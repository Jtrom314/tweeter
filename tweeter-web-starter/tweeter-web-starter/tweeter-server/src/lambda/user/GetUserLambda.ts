import { GetUserRequest, GetUserResponse, User } from "tweeter-shared"
import { UserService } from "../../model/service/userService"

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
    const userService = new UserService()
    const user: User | null = await userService.getUser(request.token, request.userAlias)
    return {
        success: true,
        message: null,
        userDto: user == null ? null : user.dto
    }
}