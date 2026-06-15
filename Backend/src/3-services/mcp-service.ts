// Backend service functions for MCP service operations.
import OpenAI from "openai";
import appConfig from "../2-utils/app-config";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

type VacationStatus = "all" | "active" | "future" | "past";

type VacationSortBy =
    | "startDate_asc"
    | "price_asc"
    | "price_desc"
    | "likes_asc"
    | "likes_desc";

type SearchArgs = {
    destination?: string;
    status?: VacationStatus;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: VacationSortBy;
    limit?: number;
};

type VacationItem = {
    vacationId: number;
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: number;
    imageName: string;
    likesCount: number;
};

type TextContentItem = {
    type: "text";
    text: string;
};

type ToolResult = {
    content?: unknown;
    structuredContent?: {
        vacations?: unknown;
        [key: string]: unknown;
    };
};

type ParsedSearchResponse = {
    destination?: unknown;
    status?: unknown;
    minPrice?: unknown;
    maxPrice?: unknown;
    sortBy?: unknown;
    limit?: unknown;
};

class McpService {

    private readonly openAiClient = new OpenAI({
        apiKey: appConfig.openAiApiKey
    });

    // Check if a value is a regular object that can be safely inspected.
    private isRecord(value: unknown): value is Record<string, unknown> {
        return typeof value === "object" && value !== null && !Array.isArray(value);
    }

    // Check if an MCP content item is a text item.
    private isTextContentItem(value: unknown): value is TextContentItem {
        if (!this.isRecord(value)) return false;

        return value.type === "text" && typeof value.text === "string";
    }

    // Check if an unknown value matches the vacation item structure.
    private isVacationItem(value: unknown): value is VacationItem {
        if (!this.isRecord(value)) return false;

        return (
            typeof value.vacationId === "number" &&
            typeof value.destination === "string" &&
            typeof value.description === "string" &&
            typeof value.startDate === "string" &&
            typeof value.endDate === "string" &&
            typeof value.price === "number" &&
            typeof value.imageName === "string" &&
            typeof value.likesCount === "number"
        );
    }

    // Check if an unknown value is a valid vacation status filter.
    private isVacationStatus(value: unknown): value is VacationStatus {
        return (
            value === "all" ||
            value === "active" ||
            value === "future" ||
            value === "past"
        );
    }

    // Check if an unknown value is a valid vacation sorting option.
    private isVacationSortBy(value: unknown): value is VacationSortBy {
        return (
            value === "startDate_asc" ||
            value === "price_asc" ||
            value === "price_desc" ||
            value === "likes_asc" ||
            value === "likes_desc"
        );
    }

    // Extract plain text content from an MCP tool result.
    private extractText(result: ToolResult): string {
        const content = result.content;

        if (!Array.isArray(content)) return "";

        return content
            .filter(item => this.isTextContentItem(item))
            .map(item => item.text)
            .join("\n");
    }

    // Extract vacations from structured MCP content or from fallback text JSON.
    private extractVacations(result: ToolResult): VacationItem[] {
        const structuredVacations = result.structuredContent?.vacations;

        if (Array.isArray(structuredVacations)) {
            return structuredVacations.filter(item => this.isVacationItem(item));
        }

        const text = this.extractText(result);

        try {
            const parsed = JSON.parse(text) as unknown;

            if (!Array.isArray(parsed)) return [];

            return parsed.filter(item => this.isVacationItem(item));
        }
        catch {
            return [];
        }
    }

    // Extract statistics from structured MCP content or from fallback text JSON.
    private extractStats(result: ToolResult): Record<string, unknown> {
        if (result.structuredContent) {
            return result.structuredContent;
        }

        const text = this.extractText(result);

        try {
            const parsed = JSON.parse(text) as unknown;

            if (!this.isRecord(parsed)) return {};

            return parsed;
        }
        catch {
            return {};
        }
    }

    // Normalize a possible destination value returned by the AI.
    private normalizeDestination(value: unknown): string | undefined {
        if (typeof value !== "string") return undefined;

        const cleaned = value.trim();
        const lower = cleaned.toLowerCase();

        const blockedValues = [
            "vacation",
            "vacations",
            "trip",
            "trips",
            "holiday",
            "holidays",
            "database",
            "data",
            "price",
            "prices",
            "like",
            "likes",
            "what",
            "which",
            "show",
            "tell",
            "give",
            "most",
            "least",
            "expensive",
            "cheapest",
            "popular",
            "active",
            "future",
            "past"
        ];

        if (!cleaned || blockedValues.includes(lower)) {
            return undefined;
        }

        if (cleaned.length < 2) {
            return undefined;
        }

        return cleaned;
    }

    // Check that the user question clearly refers to a specific destination.
    private hasExplicitDestinationContext(question: string, destination: string): boolean {
        const q = question.toLowerCase();
        const d = destination.toLowerCase();

        return (
            q.includes(` in ${d}`) ||
            q.includes(` to ${d}`) ||
            q.includes(` for ${d}`) ||
            q.includes(` in ${d}?`) ||
            q.includes(` to ${d}?`) ||
            q.includes(` for ${d}?`)
        );
    }

    // Build a direct answer for simple ranking questions.
    private buildDirectAnswer(searchArgs: SearchArgs, vacations: VacationItem[]): string | null {
        if (vacations.length === 0) {
            return "The information does not exist in the database.";
        }

        const first = vacations[0]!;

        if (searchArgs.sortBy === "price_desc") {
            return `The most expensive vacation is ${first.destination}, priced at ${first.price}.`;
        }

        if (searchArgs.sortBy === "price_asc") {
            return `The cheapest vacation is ${first.destination}, priced at ${first.price}.`;
        }

        if (searchArgs.sortBy === "likes_desc") {
            return `The most liked vacation is ${first.destination}, with ${first.likesCount} likes.`;
        }

        if (searchArgs.sortBy === "likes_asc") {
            return `The least liked vacation is ${first.destination}, with ${first.likesCount} likes.`;
        }

        return null;
    }

    // Parse the user's natural language question into structured vacation search arguments.
    private async parseQuestionToSearchArgs(question: string): Promise<SearchArgs> {
        const q = question.toLowerCase().trim();
        const args: SearchArgs = {};

        if (
            q.includes("most expensive") ||
            q.includes("highest price")
        ) {
            args.sortBy = "price_desc";
            args.limit = 1;
        }

        if (
            q.includes("cheapest") ||
            q.includes("lowest price")
        ) {
            args.sortBy = "price_asc";
            args.limit = 1;
        }

        if (
            q.includes("most liked") ||
            q.includes("most popular") ||
            q.includes("highest likes")
        ) {
            args.sortBy = "likes_desc";
            args.limit = 1;
        }

        if (
            q.includes("least liked") ||
            q.includes("lowest likes")
        ) {
            args.sortBy = "likes_asc";
            args.limit = 1;
        }

        if (q.includes("active")) {
            args.status = "active";
        }

        if (q.includes("future") || q.includes("upcoming")) {
            args.status = "future";
        }

        if (q.includes("past") || q.includes("ended")) {
            args.status = "past";
        }

        const response = await this.openAiClient.responses.create({
            model: appConfig.aiModel,
            input: `Extract vacation search filters from this user question.

Return ONLY valid JSON in this exact shape:
{
  "destination": string | null,
  "status": "all" | "active" | "future" | "past" | null,
  "minPrice": number | null,
  "maxPrice": number | null,
  "sortBy": "startDate_asc" | "price_asc" | "price_desc" | "likes_asc" | "likes_desc" | null,
  "limit": number | null
}

Rules:
- destination must be a real city, country, or destination name only
- do not use generic words such as vacation, trip, holiday, database, data, price, or likes as destination
- status = active, future, or past only if clearly mentioned
- minPrice = only if the user asks for price higher than, above, or at least
- maxPrice = only if the user asks for price lower than, under, cheaper than, or up to
- sortBy:
  - "price_desc" for most expensive or highest price
  - "price_asc" for cheapest or lowest price
  - "likes_desc" for most liked, highest likes, or most popular
  - "likes_asc" for least liked or lowest likes
- limit = 1 for questions asking for:
  - the most expensive vacation
  - the cheapest vacation
  - the most liked vacation
  - the least liked vacation
  - the highest or lowest single vacation
- if not mentioned, use null
- return JSON only, no explanation

User question:
${question}`
        });

        const text = response.output_text.trim();

        try {
            const parsed = JSON.parse(text) as ParsedSearchResponse;

            const normalizedDestination = this.normalizeDestination(parsed.destination);

            if (normalizedDestination && this.hasExplicitDestinationContext(question, normalizedDestination)) {
                args.destination = normalizedDestination;
            }

            if (this.isVacationStatus(parsed.status) && !args.status) {
                args.status = parsed.status;
            }

            if (parsed.minPrice !== null && parsed.minPrice !== undefined) {
                const minPrice = Number(parsed.minPrice);

                if (!Number.isNaN(minPrice)) {
                    args.minPrice = minPrice;
                }
            }

            if (parsed.maxPrice !== null && parsed.maxPrice !== undefined) {
                const maxPrice = Number(parsed.maxPrice);

                if (!Number.isNaN(maxPrice)) {
                    args.maxPrice = maxPrice;
                }
            }

            if (this.isVacationSortBy(parsed.sortBy) && !args.sortBy) {
                args.sortBy = parsed.sortBy;
            }

            if (
                parsed.limit !== null &&
                parsed.limit !== undefined &&
                args.limit === undefined
            ) {
                const limit = Number(parsed.limit);

                if (!Number.isNaN(limit)) {
                    args.limit = limit;
                }
            }

            return args;
        }
        catch {
            return args;
        }
    }

    // Send a question to the MCP endpoint and return the final user-facing answer.
    public async askQuestion(question: string): Promise<string> {
        if (!question.trim()) {
            throw new Error("Question is required.");
        }

        if (!appConfig.openAiApiKey) {
            throw new Error("Missing OPENAI_API_KEY.");
        }

        const client = new Client({
            name: "vacations-backend-client",
            version: "1.0.0"
        });

        const transport = new StreamableHTTPClientTransport(
            new URL("http://localhost:4000/mcp-server")
        );

        try {
            await client.connect(transport as unknown as Parameters<typeof client.connect>[0]);

            const searchArgs = await this.parseQuestionToSearchArgs(question);

            const vacationsResult = await client.callTool({
                name: "search_vacations",
                arguments: searchArgs
            });

            const statsResult = await client.callTool({
                name: "vacations_stats",
                arguments: {}
            });

            const vacations = this.extractVacations(vacationsResult as ToolResult);

            const directAnswer = this.buildDirectAnswer(searchArgs, vacations);

            if (directAnswer) {
                return directAnswer;
            }

            const toolsData = {
                searchArgs,
                vacations,
                stats: this.extractStats(statsResult as ToolResult)
            };

            const response = await this.openAiClient.responses.create({
                model: appConfig.aiModel,
                input: `Answer the user's question only according to the MCP tool results below.
If the answer does not exist in the data, say that the information does not exist in the database.
Keep the answer short and clear.

MCP tool results:
${JSON.stringify(toolsData, null, 2)}

User question:
${question}`
            });

            return response.output_text;
        }
        finally {
            try {
                await transport.terminateSession?.();
            }
            catch {
            }

            try {
                await client.close();
            }
            catch {
            }
        }
    }
}

const mcpService = new McpService();

export default mcpService;