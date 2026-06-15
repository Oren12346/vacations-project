// HTTP bridge that exposes the MCP server tools over regular API calls.
import { Router, Request, Response, NextFunction } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import mcpServerBuilder from "./mcp-server";

class McpHttp {

    public readonly router = Router();

    public constructor() {
        this.router.all("/", this.handleMcpRequest);
    }

    private async handleMcpRequest(request: Request, response: Response, _next: NextFunction): Promise<void> {
        const server = mcpServerBuilder.createMcpServer();

        const transport = new StreamableHTTPServerTransport({
            enableJsonResponse: true
        });

        response.on("close", () => {
            transport.close().catch(() => { });
            server.close().catch(() => { });
        });

        try {
            await server.connect(transport as unknown as Parameters<typeof server.connect>[0]);
            await transport.handleRequest(request, response, request.body);
        }
        catch (error: unknown) {
            console.error("MCP HTTP error:", error);

            if (!response.headersSent) {
                response.status(500).json({
                    jsonrpc: "2.0",
                    error: { code: -32603, message: "Internal server error" },
                    id: null
                });
            }
        }
    }
}

const mcpHttp = new McpHttp().router;

export default mcpHttp;