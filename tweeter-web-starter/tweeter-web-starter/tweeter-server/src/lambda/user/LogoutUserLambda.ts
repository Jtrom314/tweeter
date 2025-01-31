import { TweeterRequestToken, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/userService";

export const handler = async (request: TweeterRequestToken): Promise<TweeterResponse> => {
    const userService = new UserService()
    await userService.logout(request.token)
    return {
        success: true,
        message: null
    }
}