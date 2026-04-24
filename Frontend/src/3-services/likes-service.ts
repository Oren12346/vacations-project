// Frontend service functions for likes service operations.
import axios from "axios";
import appConfig from "../2-utils/app-config";

class LikesService {

    // Add a like for the selected vacation.
    public async addLike(vacationId: number): Promise<void> {
        const like = { vacationId };
        await axios.post(appConfig.likesUrl, like);
    }

    // Remove a like from the selected vacation.
    public async removeLike(vacationId: number): Promise<void> {
        await axios.delete(appConfig.likesUrl + vacationId);
    }
}

const likesService = new LikesService();
export default likesService;