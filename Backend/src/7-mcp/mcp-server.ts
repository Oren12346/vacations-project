// MCP server setup for project-specific tools and prompts.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";
import dal from "../2-utils/dal";

// Handle the create mcp server flow for this file.
function createMcpServer() {
    const mcpServer = new McpServer(
        { name: "vacations-mcp-server", version: "1.0.0" },
        {
            instructions:
                "Use these tools only for questions about the vacations database."
        }
    );

    mcpServer.registerTool(
        "search_vacations",
        {
            title: "Search Vacations",
            description: "Returns vacations from the database with likes count.",
            inputSchema: z.object({
                destination: z.string().optional(),
                status: z.enum(["all", "active", "future", "past"]).optional(),
                minPrice: z.number().optional(),
                maxPrice: z.number().optional(),
                sortBy: z.enum([
                    "startDate_asc",
                    "price_asc",
                    "price_desc",
                    "likes_asc",
                    "likes_desc"
                ]).optional(),
                limit: z.number().optional()
            })
        },
        async (args) => {

            const today = new Date().toISOString().slice(0, 10);

            let sql = `
            SELECT
                v.vacationId,
                v.destination,
                v.description,
                v.startDate,
                v.endDate,
                v.price,
                v.imageName,
                COUNT(l.userId) AS likesCount
            FROM vacations v
            LEFT JOIN likes l ON v.vacationId = l.vacationId
            WHERE 1=1
        `;

            const values: any[] = [];

            if (args.destination) {
                sql += ` AND v.destination LIKE ? `;
                values.push(`%${args.destination}%`);
            }

            if (args.status === "active") {
                sql += ` AND v.startDate <= ? AND v.endDate >= ? `;
                values.push(today, today);
            }

            if (args.status === "future") {
                sql += ` AND v.startDate > ? `;
                values.push(today);
            }

            if (args.status === "past") {
                sql += ` AND v.endDate < ? `;
                values.push(today);
            }

            if (args.minPrice !== undefined) {
                sql += ` AND v.price >= ? `;
                values.push(args.minPrice);
            }

            if (args.maxPrice !== undefined) {
                sql += ` AND v.price <= ? `;
                values.push(args.maxPrice);
            }

            sql += `
            GROUP BY
                v.vacationId,
                v.destination,
                v.description,
                v.startDate,
                v.endDate,
                v.price,
                v.imageName
        `;

            if (args.sortBy === "price_asc") {
                sql += ` ORDER BY v.price ASC `;
            }
            else if (args.sortBy === "price_desc") {
                sql += ` ORDER BY v.price DESC `;
            }
            else if (args.sortBy === "likes_asc") {
                sql += ` ORDER BY likesCount ASC `;
            }
            else if (args.sortBy === "likes_desc") {
                sql += ` ORDER BY likesCount DESC `;
            }
            else {
                sql += ` ORDER BY v.startDate ASC `;
            }

            if (args.limit !== undefined && args.limit > 0) {
                const safeLimit = Math.floor(args.limit);
                sql += ` LIMIT ${safeLimit} `;
            }


            const vacations = await dal.execute(sql, values) as {
                vacationId: number;
                destination: string;
                description: string;
                startDate: string;
                endDate: string;
                price: number;
                imageName: string;
                likesCount: number;
            }[];

            const normalizedVacations = vacations.map(v => ({
                ...v,
                price: Number(v.price),
                likesCount: Number(v.likesCount)
            }));


            return {
                content: [
                    { type: "text", text: JSON.stringify(normalizedVacations) }
                ],
                structuredContent: { vacations: normalizedVacations }
            };
        }
    );

    mcpServer.registerTool(
        "vacations_stats",
        {
            title: "Vacations Stats",
            description: "Returns general statistics about vacations.",
            inputSchema: z.object({})
        },
        async () => {
            const today = new Date().toISOString().slice(0, 10);

            const sql = `
                SELECT
                    COUNT(*) AS totalVacations,
                    AVG(price) AS averagePrice,
                    MIN(price) AS minPrice,
                    MAX(price) AS maxPrice,
                    SUM(CASE WHEN startDate <= ? AND endDate >= ? THEN 1 ELSE 0 END) AS activeVacations,
                    SUM(CASE WHEN startDate > ? THEN 1 ELSE 0 END) AS futureVacations,
                    SUM(CASE WHEN endDate < ? THEN 1 ELSE 0 END) AS pastVacations
                FROM vacations
            `;

            const result = await dal.execute(sql, [today, today, today, today]) as {
                totalVacations: number;
                averagePrice: number;
                minPrice: number;
                maxPrice: number;
                activeVacations: number;
                futureVacations: number;
                pastVacations: number;
            }[];

            const stats = {
                totalVacations: Number(result[0]?.totalVacations ?? 0),
                averagePrice: Number(result[0]?.averagePrice ?? 0),
                minPrice: Number(result[0]?.minPrice ?? 0),
                maxPrice: Number(result[0]?.maxPrice ?? 0),
                activeVacations: Number(result[0]?.activeVacations ?? 0),
                futureVacations: Number(result[0]?.futureVacations ?? 0),
                pastVacations: Number(result[0]?.pastVacations ?? 0)
            };

            return {
                content: [
                    { type: "text", text: JSON.stringify(stats) }
                ],
                structuredContent: stats
            };
        }
    );

    return mcpServer;
}

export default createMcpServer;