// Model definition for like model data used in the application.
class LikeModel {
    public userId!: number;
    public vacationId!: number;

    public validate(): void {
        if (!this.userId || this.userId <= 0) {
            throw new Error("Invalid userId.");
        }

        if (!this.vacationId || this.vacationId <= 0) {
            throw new Error("Invalid vacationId.");
        }
    }
}

export default LikeModel;