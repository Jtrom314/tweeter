import { TweeterRequestToken, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/userService";
import { AWSDAOFactory } from "../../model/DAO/factory/AWSDAOFactory";

export const handler = async (request: TweeterRequestToken): Promise<TweeterResponse> => {
    const userService = new UserService(AWSDAOFactory.getInstance())
    await userService.logout(request.token)
    return {
        success: true,
        message: null
    }
}