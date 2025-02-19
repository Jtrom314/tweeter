import { GetUserRequest, GetUserResponse, User } from "tweeter-shared"
import { UserService } from "../../model/service/userService"
import { AWSDAOFactory } from "../../model/DAO/factory/AWSDAOFactory"

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
    const userService = new UserService(AWSDAOFactory.getInstance())
    const user: User | null = await userService.getUser(request.token, request.userAlias)
    return {
        success: true,
        message: null,
        userDto: user == null ? null : user.dto
    }
}