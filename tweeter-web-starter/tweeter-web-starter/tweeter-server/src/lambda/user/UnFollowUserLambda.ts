import { DualNumberResponse, GeneralUserRequest, User } from "tweeter-shared";
import { UserService } from "../../model/service/userService";
import { AWSDAOFactory } from "../../model/DAO/factory/AWSDAOFactory";

export const handler = async (request: GeneralUserRequest): Promise<DualNumberResponse> => {
    const userService = new UserService(AWSDAOFactory.getInstance())
    const [followerCount, followeeCount] = await userService.unfollow(request.token, User.fromDto(request.user)!)
    return {
        success: true,
        message: null,
        followeeCount,
        followerCount
    }
}