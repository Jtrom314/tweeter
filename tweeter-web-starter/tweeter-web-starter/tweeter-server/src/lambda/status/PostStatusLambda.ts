import { PostStatusItemRequest, Status, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/statusService";
import { AWSDAOFactory } from "../../model/DAO/factory/AWSDAOFactory";

export const handler = async (request: PostStatusItemRequest): Promise<TweeterResponse> => {
    const statusService = new StatusService(AWSDAOFactory.getInstance())
    await statusService.postStatus(request.token, request.status)
    return {
        success: true,
        message: null
    }
}