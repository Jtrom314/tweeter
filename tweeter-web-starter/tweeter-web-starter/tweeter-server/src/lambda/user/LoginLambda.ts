import { AuthResponse, LoginRequest } from "tweeter-shared"
import { UserService } from "../../model/service/userService"
import { AWSDAOFactory } from "../../model/DAO/factory/AWSDAOFactory"

export const handler = async (request: LoginRequest): Promise<AuthResponse> => {
    const userService = new UserService(AWSDAOFactory.getInstance())
    const [user, authToken] = await userService.login(request.alias, request.password)

    return {
        success: true,
        message: null,
        user: user.dto,
        authToken: authToken.dto
    }
}