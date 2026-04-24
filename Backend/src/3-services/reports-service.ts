// Backend service functions for reports service operations.
import ReportRowModel from "../1-models/report-row-model";
import dal from "../2-utils/dal";

class ReportsService {

    // Load report rows that contain destinations and likes counts.
    public async getVacationsLikesReport(): Promise<ReportRowModel[]> {
        const sql = `
            SELECT
                v.destination,
                COUNT(l.userId) AS likesCount
            FROM vacations v
            LEFT JOIN likes l
                ON v.vacationId = l.vacationId
            GROUP BY v.vacationId, v.destination
            ORDER BY v.startDate ASC
        `;

        const report = await dal.execute(sql) as ReportRowModel[];
        return report;
    }
}

const reportsService = new ReportsService();
export default reportsService;
