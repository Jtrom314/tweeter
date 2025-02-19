import { AWSDAOFactory } from "../../model/DAO/factory/AWSDAOFactory"
import { UserService } from "../../model/service/userService"
import { BoolResponse, GeneralUserRequest, User } from "tweeter-shared"

export const handler = async (request: GeneralUserRequest): Promise<BoolResponse> =>  {
    const userService = new UserService(AWSDAOFactory.getInstance())
    const isFollower = await userService.getIsFollowerStatus(request.token, User.fromDto(request.user!)!, User.fromDto(request.addtionalUser!)!)
    return {
        success: true,
        message: null,
        booleanValue: isFollower
    }
}