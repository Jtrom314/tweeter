import { DualNumberResponse, GeneralUserRequest, User } from "tweeter-shared";
import { UserService } from "../../model/service/userService";

export const handler = async (request: GeneralUserRequest): Promise<DualNumberResponse> => {
    const userService = new UserService()
    const [followerCount, followeeCount] = await userService.unfollow(request.token, User.fromDto(request.user)!)
    return {
        success: true,
        message: null,
        followeeCount,
        followerCount
    }
}