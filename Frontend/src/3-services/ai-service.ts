// Frontend service functions for ai service operations.
import axios from "axios";
import appConfig from "../2-utils/app-config";

class AiService {

    // Ask the AI service for a travel recommendation.
    public async getRecommendation(question: string): Promise<string> {
        const response = await axios.post(appConfig.aiRecommendationUrl, { question });
        return response.data.answer;
    }
}

const aiService = new AiService();
export default aiService;