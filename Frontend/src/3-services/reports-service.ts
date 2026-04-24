import axios from "axios";
import appConfig from "../2-utils/app-config";
import ReportRowModel from "../1-models/report-row-model";

class ReportsService {

    // Fetch the vacations likes report data from the backend.
    public async getVacationsLikesReport(): Promise<ReportRowModel[]> {
        const response = await axios.get<ReportRowModel[]>(appConfig.vacationsLikesReportUrl);
        return response.data;
    }

    // Download the vacations likes report as a CSV file.
    public async downloadVacationsLikesCsv(): Promise<void> {
        const response = await axios.get(appConfig.vacationsLikesCsvUrl, {
            responseType: "blob"
        });

        // Create a temporary browser URL for the downloaded CSV file.
        const fileUrl = URL.createObjectURL(response.data);

        // Create a temporary link element to trigger the file download.
        const a = document.createElement("a");
        a.href = fileUrl;
        a.download = "vacations-likes.csv";
        a.click();

        // Release the temporary URL from memory after the download starts.
        URL.revokeObjectURL(fileUrl);
    }
}

const reportsService = new ReportsService();
export default reportsService;