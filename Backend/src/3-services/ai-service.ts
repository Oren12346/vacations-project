// Backend service functions for ai service operations.
import OpenAI from "openai";
import appConfig from "../2-utils/app-config";

type RecommendationData = {
    whyVisit: string;
    bestFor: string;
    tip: string;
};

class AiService {
    private readonly client = new OpenAI({
        apiKey: appConfig.openAiApiKey
    });

    // Ask the AI service for a travel recommendation.
    public async getRecommendation(question: string): Promise<string> {
        if (!question.trim()) {
            throw new Error("Destination is required.");
        }

        if (!appConfig.openAiApiKey) {
            throw new Error("Missing OPENAI_API_KEY.");
        }

        const response = await this.client.responses.create({
            model: appConfig.aiModel,
            instructions: `
You are a travel recommendation assistant.
Return valid JSON only.
Keep the answer short, simple, and friendly.
Do not use markdown.
Do not use bullet points.
Do not use asterisks.
Each value should be one short sentence.
            `.trim(),
            input: `Give a short travel recommendation for this destination: ${question}`,
            max_output_tokens: 120,
            text: {
                verbosity: "low",
                format: {
                    type: "json_schema",
                    name: "travel_recommendation",
                    strict: true,
                    schema: {
                        type: "object",
                        properties: {
                            whyVisit: {
                                type: "string",
                                description: "One short reason why the place is worth visiting."
                            },
                            bestFor: {
                                type: "string",
                                description: "One short sentence describing the best type of traveler for this destination."
                            },
                            tip: {
                                type: "string",
                                description: "One short practical travel tip."
                            }
                        },
                        required: ["whyVisit", "bestFor", "tip"],
                        additionalProperties: false
                    }
                }
            }
        });

        const data = JSON.parse(response.output_text) as RecommendationData;

        return [
            `Why visit: ${data.whyVisit}`,
            `Best for: ${data.bestFor}`,
            `Tip: ${data.tip}`
        ].join("\n");
    }
}

const aiService = new AiService();
export default aiService;
