import dal from "../2-utils/dal";
import LikeModel from "../1-models/like-model";

class LikesService {

    public async addLike(userId: number, vacationId: number): Promise<void> {
        const like = new LikeModel();
        like.userId = userId;
        like.vacationId = vacationId;
        like.validate();

        const sql = `INSERT INTO likes(userId, vacationId) VALUES(?, ?)`;
        await dal.execute(sql, [like.userId, like.vacationId]);
    }

    public async removeLike(userId: number, vacationId: number): Promise<void> {
        const like = new LikeModel();
        like.userId = userId;
        like.vacationId = vacationId;
        like.validate();

        const sql = `DELETE FROM likes WHERE userId = ? AND vacationId = ?`;
        await dal.execute(sql, [like.userId, like.vacationId]);
    }
}

const likesService = new LikesService();
export default likesService;