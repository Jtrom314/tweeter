import { GeneralUserRequest, User, UserFolloweeFollowerResponse } from "tweeter-shared"
import { UserService } from "../../model/service/userService"

export const handler = async (request: GeneralUserRequest): Promise<UserFolloweeFollowerResponse> => {
    const userService = new UserService()
    const followees = await userService.getFolloweeCount(request.token, User.fromDto(request.user)!)
    return {
        success: true,
        message: null,
        followNumber: followees
    }
}