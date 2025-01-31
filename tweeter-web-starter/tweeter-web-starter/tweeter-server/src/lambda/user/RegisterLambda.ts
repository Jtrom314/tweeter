import { AuthResponse, RegisterRequest } from "tweeter-shared"
import { UserService } from "../../model/service/userService"

export const handler = async (request: RegisterRequest): Promise<AuthResponse> => {
    const userService = new UserService()
    const [user, authToken] = await userService.register(request.firstName, request.lastName, request.alias, request.password, request.userImageBytes, request.imageFileExtension)
    return {
        success: true,
        message: null,
        user: user.dto,
        authToken: authToken.dto
    }
}