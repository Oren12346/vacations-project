// Frontend service functions for vacations service operations.
import appConfig from "../2-utils/app-config";
import { VacationModel } from "../1-models/vacation-model";
import axios from "axios";

class VacationsService {

    // Fetch all vacations from the server or database.
    public async getAllVacations(): Promise<VacationModel[]> {
        const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl);
        return response.data;
    }

    // Create a new vacation record.
    public async addVacation(formData: FormData): Promise<VacationModel> {
        const response = await axios.post<VacationModel>(appConfig.vacationsUrl, formData);
        return response.data;
    }

    // Delete a vacation by its id.
    public async deleteVacation(vacationId: number): Promise<void> {
        await axios.delete(appConfig.vacationsUrl + vacationId);
    }

    // Fetch one vacation by its id.
    public async getOneVacation(vacationId: number): Promise<VacationModel> {
        const response = await axios.get<VacationModel>(appConfig.vacationsUrl + vacationId);
        return response.data;
    }

    // Update an existing vacation record.
    public async updateVacation(vacationId: number, formData: FormData): Promise<VacationModel> {
        const response = await axios.put<VacationModel>(appConfig.vacationsUrl + vacationId, formData);
        return response.data;
    }
}

const vacationsService = new VacationsService();
export default vacationsService;