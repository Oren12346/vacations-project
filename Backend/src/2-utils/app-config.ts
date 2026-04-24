// Central backend configuration values loaded from the environment.
class AppConfig {
    public port = Number(process.env.PORT) || 4000;
    public dbHost = process.env.DB_HOST || "localhost";
    public dbPort = Number(process.env.DB_PORT) || 3306;
    public dbUser = process.env.DB_USER || "root";
    public dbPassword = process.env.DB_PASSWORD || "";
    public dbName = process.env.DB_NAME || "vacations_db";
    public jwtSecret = process.env.JWT_SECRET || "";
    public openAiApiKey = process.env.OPENAI_API_KEY || "";
    public aiModel = "gpt-5.4";
}

const appConfig = new AppConfig();

export default appConfig;