// Page component responsible for the Reports screen.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ReportRowModel from "../../1-models/report-row-model";
import reportsService from "../../3-services/reports-service";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    LabelList
} from "recharts";
import "./Reports.css";

type UserPayload = {
    role: string;
};

// Render the reports page for admin users only.
function Reports() {
    const [report, setReport] = useState<ReportRowModel[]>([]);
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();

    // Verify admin access and load the likes report.
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const user = jwtDecode<UserPayload>(token);

            if (user.role !== "admin") {
                navigate("/vacations-list");
                return;
            }
        }
        catch {
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }

        reportsService.getVacationsLikesReport()
            .then((reportFromServer) => {
                setReport(reportFromServer);
            })
            .catch((error) => {
                console.error(error);
                setError("Failed to load report.");
            });
    }, [navigate]);

    // Ask the reports service to download the likes report as a CSV file.
    async function downloadCsv(): Promise<void> {
        try {
            await reportsService.downloadVacationsLikesCsv();
        }
        catch (error) {
            console.error(error);
            setError("Failed to download CSV.");
        }
    }
    return (
        <div className="reports">
            <div className="reports-card">
                <h2>Reports</h2>
                <p className="reports-subtitle">Vacation likes overview</p>

                {error && <p className="error-message">{error}</p>}

                <div className="reports-actions">
                    <button onClick={downloadCsv}>Download CSV</button>
                </div>

                {report.length === 0 && !error ? (
                    <div className="empty-message">No report data available yet.</div>
                ) : (
                    <div className="chart-box">
                        <ResponsiveContainer width="100%" height={420}>
                            <BarChart
                                data={report} margin={{ top: 20, right: 20, left: 10, bottom: 80 }}
                            >
                                <CartesianGrid stroke="var(--reports-grid-color)" strokeDasharray="3 3" />

                                <XAxis dataKey="destination" interval={0} angle={-20} textAnchor="end" height={80}
                                    tickMargin={12} stroke="var(--reports-axis-color)" tick={{ fontSize: 12 }} />

                                <YAxis allowDecimals={false} stroke="var(--reports-axis-color)"
                                    tick={{ fontSize: 12 }}
                                    domain={[0, 8]}
                                    ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                                />

                                <Tooltip />

                                <Bar dataKey="likesCount" fill="var(--reports-bar-color)" radius={[8, 8, 0, 0]} maxBarSize={58}
                                >
                                    <LabelList dataKey="likesCount" position="top" fill="var(--reports-label-color)" fontSize={12} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Reports;