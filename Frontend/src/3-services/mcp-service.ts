// Frontend service functions for mcp service operations.
import axios from "axios";
import appConfig from "../2-utils/app-config";

class McpService {

    // Send a question to the MCP endpoint and return the reply.
    public async askQuestion(question: string): Promise<string> {
        const response = await axios.post(appConfig.mcpQuestionUrl, { question });
        return response.data.answer;
    }
}

const mcpService = new McpService();
export default mcpService;