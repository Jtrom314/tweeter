import { AuthResponse, RegisterRequest } from "tweeter-shared"
import { UserService } from "../../model/service/userService"
import { AWSDAOFactory } from "../../model/DAO/factory/AWSDAOFactory"

export const handler = async (request: RegisterRequest): Promise<AuthResponse> => {
    const userService = new UserService(AWSDAOFactory.getInstance())
    const [user, authToken] = await userService.register(request.firstName, request.lastName, request.alias, request.password, request.userImageBytes, request.imageFileExtension)
    return {
        success: true,
        message: null,
        user: user.dto,
        authToken: authToken.dto
    }
}