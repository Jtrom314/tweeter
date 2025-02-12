import { GeneralUserRequest, User, UserFolloweeFollowerResponse } from "tweeter-shared"
import { UserService } from "../../model/service/userService"
import { AWSDAOFactory } from "../../model/DAO/factory/AWSDAOFactory"

export const handler = async (request: GeneralUserRequest): Promise<UserFolloweeFollowerResponse> => {
    const userService = new UserService(AWSDAOFactory.getInstance())
    const followees = await userService.getFolloweeCount(request.token, User.fromDto(request.user)!)
    return {
        success: true,
        message: null,
        followNumber: followees
    }
}