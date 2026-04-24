// Backend service functions for mcp service operations.
import OpenAI from "openai";
import appConfig from "../2-utils/app-config";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const openAiClient = new OpenAI({
    apiKey: appConfig.openAiApiKey
});

type SearchArgs = {
    destination?: string;
    status?: "all" | "active" | "future" | "past";
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "startDate_asc" | "price_asc" | "price_desc" | "likes_asc" | "likes_desc";
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

// Handle the extract text flow for this file.
function extractText(result: any): string {
    const content = result?.content;

    if (!Array.isArray(content)) return "";

    return content
        .filter((item: any) => item?.type === "text")
        .map((item: any) => item.text)
        .join("\n");
}

// Handle the extract vacations flow for this file.
function extractVacations(result: any): VacationItem[] {
    const structuredVacations = result?.structuredContent?.vacations;

    if (Array.isArray(structuredVacations)) {
        return structuredVacations;
    }

    const text = extractText(result);

    try {
        const parsed = JSON.parse(text);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch {
        return [];
    }
}

// Handle the extract stats flow for this file.
function extractStats(result: any): any {
    if (result?.structuredContent) {
        return result.structuredContent;
    }

    const text = extractText(result);

    try {
        return JSON.parse(text);
    }
    catch {
        return {};
    }
}

// Handle the normalize destination flow for this file.
function normalizeDestination(value: unknown): string | undefined {
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

// Handle the has explicit destination context flow for this file.
function hasExplicitDestinationContext(question: string, destination: string): boolean {
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

// Handle the build direct answer flow for this file.
function buildDirectAnswer(searchArgs: SearchArgs, vacations: VacationItem[]): string | null {
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

// Handle the parse question to search args flow for this file.
async function parseQuestionToSearchArgs(question: string): Promise<SearchArgs> {
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

    const response = await openAiClient.responses.create({
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
        const parsed = JSON.parse(text);

        const normalizedDestination = normalizeDestination(parsed.destination);

        if (normalizedDestination && hasExplicitDestinationContext(question, normalizedDestination)) {
            args.destination = normalizedDestination;
        }

        if (parsed.status && !args.status) {
            args.status = parsed.status;
        }

        if (parsed.minPrice !== null && parsed.minPrice !== undefined) {
            args.minPrice = Number(parsed.minPrice);
        }

        if (parsed.maxPrice !== null && parsed.maxPrice !== undefined) {
            args.maxPrice = Number(parsed.maxPrice);
        }

        if (parsed.sortBy && !args.sortBy) {
            args.sortBy = parsed.sortBy;
        }

        if (
            parsed.limit !== null &&
            parsed.limit !== undefined &&
            args.limit === undefined
        ) {
            args.limit = Number(parsed.limit);
        }

        return args;
    }
    catch {
        return args;
    }
}

// Send a question to the MCP endpoint and return the reply.
async function askQuestion(question: string): Promise<string> {
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
        await client.connect(transport as any);

        const searchArgs = await parseQuestionToSearchArgs(question);

        const vacationsResult = await client.callTool({
            name: "search_vacations",
            arguments: searchArgs
        });

        const statsResult = await client.callTool({
            name: "vacations_stats",
            arguments: {}
        });

        const vacations = extractVacations(vacationsResult);

        const directAnswer = buildDirectAnswer(searchArgs, vacations);

        if (directAnswer) {
            return directAnswer;
        }

        const toolsData = {
            searchArgs,
            vacations,
            stats: extractStats(statsResult)
        };

        const response = await openAiClient.responses.create({
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

class McpService {

    // Send a question to the MCP endpoint and return the reply.
    public async askQuestion(question: string): Promise<string> {
        return askQuestion(question);
    }
}

const mcpService = new McpService();
export default mcpService;