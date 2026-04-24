// Model definition for vacation model data used in the application.
export class  VacationModel {
    public vacationId?: number;
    public destination!: string;
    public description!: string;
    public startDate!: string;
    public endDate!: string;
    public price?: number;
    public imageName!: string;
    public likesCount?: number;
    public isLiked?: boolean;

}