class VacationModel {
    public vacationId?: number;
    public destination!: string;
    public description!: string;
    public startDate!: string;
    public endDate!: string;
    public price!: number;
    public imageName!: string;

    private validateCommon(): void {
        if (
            !this.destination?.trim() ||
            !this.description?.trim() ||
            !this.startDate ||
            !this.endDate ||
            this.price === undefined ||
            this.price === null
        ) {
            throw new Error("Missing required fields");
        }

        this.destination = this.destination.trim();
        this.description = this.description.trim();

        if (this.price <= 0 || this.price > 10000) {
            throw new Error("Price must be between 1 and 10000");
        }

        if (this.endDate < this.startDate) {
            throw new Error("End date cannot be before start date");
        }
    }

    public validateForAdd(): void {
        this.validateCommon();

        if (!this.imageName?.trim()) {
            throw new Error("Missing required fields");
        }

        this.imageName = this.imageName.trim();

        const today = new Date().toISOString().slice(0, 10);

        if (this.startDate < today) {
            throw new Error("Start date cannot be in the past");
        }
    }

    public validateForUpdate(): void {
        if (!this.vacationId || this.vacationId <= 0) {
            throw new Error("Missing vacationId");
        }

        this.validateCommon();

        if (this.imageName) {
            this.imageName = this.imageName.trim();
        }
    }

    public static validateVacationId(vacationId: number): void {
        if (!vacationId || vacationId <= 0 || Number.isNaN(vacationId)) {
            throw new Error("Invalid vacationId");
        }
    }
}

export default VacationModel;