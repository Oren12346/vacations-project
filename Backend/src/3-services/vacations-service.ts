// Backend service functions for vacations service operations.
import VacationModel from "../1-models/vacation-model";
import dal from "../2-utils/dal";
import { ResultSetHeader } from "mysql2/promise";

class VacationsService {

    // Return all vacations together with likes count and current user like state.
    public async getAllVacations(userId: number): Promise<VacationModel[]> {
        const sql = `
            SELECT
                v.vacationId,
                v.destination,
                v.description,
                DATE_FORMAT(v.startDate, '%Y-%m-%d') AS startDate,
                DATE_FORMAT(v.endDate, '%Y-%m-%d') AS endDate,
                v.price,
                v.imageName,
                (
                    SELECT COUNT(*)
                    FROM likes l
                    WHERE l.vacationId = v.vacationId
                ) AS likesCount,
                EXISTS(
                    SELECT 1
                    FROM likes l2
                    WHERE l2.vacationId = v.vacationId
                    AND l2.userId = ?
                ) AS isLiked
            FROM vacations v
            ORDER BY v.startDate ASC
        `;

        const vacations = await dal.execute(sql, [userId]) as VacationModel[];
        return vacations;
    }

    // Return a single vacation by its id.
    public async getOneVacation(vacationId: number): Promise<VacationModel | null> {
        VacationModel.validateVacationId(vacationId);
        const sql = `
            SELECT
                vacationId,
                destination,
                description,
                DATE_FORMAT(startDate, '%Y-%m-%d') AS startDate,
                DATE_FORMAT(endDate, '%Y-%m-%d') AS endDate,
                price,
                imageName
            FROM vacations
            WHERE vacationId = ?
        `;

        const vacations = await dal.execute(sql, [vacationId]) as VacationModel[];
        const vacation = vacations[0];

        if (!vacation) {
            return null;
        }

        return vacation;
    }

    // Insert a new vacation and return it with the generated id.
    public async addVacation(vacation: VacationModel): Promise<VacationModel> {
        vacation.validateForAdd();
        const sql = `
            INSERT INTO vacations(
                destination,
                description,
                startDate,
                endDate,
                price,
                imageName
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;

        const info = await dal.execute(sql, [
            vacation.destination,
            vacation.description,
            vacation.startDate,
            vacation.endDate,
            vacation.price,
            vacation.imageName
        ]) as ResultSetHeader;

        vacation.vacationId = info.insertId;
        return vacation;
    }

    // Update an existing vacation record.
    public async updateVacation(vacation: VacationModel): Promise<VacationModel> {
        vacation.validateForUpdate();
        const vacationId = vacation.vacationId!;


        const sql = `
            UPDATE vacations
            SET
                destination = ?,
                description = ?,
                startDate = ?,
                endDate = ?,
                price = ?,
                imageName = ?
            WHERE vacationId = ?
        `;

        await dal.execute(sql, [
            vacation.destination,
            vacation.description,
            vacation.startDate,
            vacation.endDate,
            vacation.price,
            vacation.imageName,
            vacationId
        ]);

        return vacation;
    }

    // Delete a vacation by id and report whether a row was removed.
    public async deleteVacation(vacationId: number): Promise<boolean> {
        VacationModel.validateVacationId(vacationId);
        const sql = `
            DELETE FROM vacations
            WHERE vacationId = ?
        `;

        const info = await dal.execute(sql, [vacationId]) as ResultSetHeader;

        if (info.affectedRows === 0) {
            return false;
        }

        return true;
    }
}

const vacationsService = new VacationsService();
export default vacationsService;