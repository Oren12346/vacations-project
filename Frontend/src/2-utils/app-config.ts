// Frontend configuration object with all API endpoint URLs.
class AppConfig {

    public readonly apiUrl = "http://localhost:4000/api";
    public readonly vacationsUrl = this.apiUrl + "/vacations/";
    public readonly registerUrl = this.apiUrl + "/auth/register/";
    public readonly loginUrl = this.apiUrl + "/auth/login/";
    public readonly reportUrl = this.apiUrl + "/reports/";
    public readonly vacationsLikesReportUrl = this.reportUrl + "vacations-likes";
    public readonly vacationsLikesCsvUrl = this.reportUrl + "vacations-likes/csv";
    public readonly likesUrl = this.apiUrl + "/likes/";
    public readonly imageUrl = "http://localhost:4000/images/";
    public readonly aiUrl = this.apiUrl + "/ai/";
    public readonly aiRecommendationUrl = this.aiUrl + "recommendation";
    public readonly mcpUrl = this.apiUrl + "/mcp/";
    public readonly mcpQuestionUrl = this.mcpUrl + "question";
}


const appConfig = new AppConfig();

export default appConfig