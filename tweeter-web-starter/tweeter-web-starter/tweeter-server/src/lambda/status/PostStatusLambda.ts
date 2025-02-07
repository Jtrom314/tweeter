import { PostStatusItemRequest, Status, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/statusService";

export const handler = async (request: PostStatusItemRequest): Promise<TweeterResponse> => {
    const statusService = new StatusService()
    await statusService.postStatus(request.token, Status.fromDto(request.status)!)
    return {
        success: true,
        message: null
    }
}