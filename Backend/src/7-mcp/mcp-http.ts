// HTTP bridge that exposes the MCP server tools over regular API calls.
import { Router, Request, Response, NextFunction } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import createMcpServer from "./mcp-server";

const router = Router();

router.all("/", async (request: Request, response: Response, next: NextFunction) => {
    const server = createMcpServer();
    const transport = new StreamableHTTPServerTransport({
        enableJsonResponse: true
    });

    response.on("close", () => {
        transport.close().catch(() => {});
        server.close().catch(() => {});
    });

    try {
        await server.connect(transport as any);
        await transport.handleRequest(request, response, request.body);
    }
    catch (error) {
        console.error("MCP HTTP error:", error);

        if (!response.headersSent) {
            response.status(500).json({
                jsonrpc: "2.0",
                error: { code: -32603, message: "Internal server error" },
                id: null
            });
        }
    }
});

export default router;