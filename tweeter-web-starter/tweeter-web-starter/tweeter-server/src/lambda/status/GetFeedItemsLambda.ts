import { PagedUserItemRequest, PagedUserItemResponse, StatusDto } from "tweeter-shared";
import { StatusService } from "../../model/service/statusService";
import { AWSDAOFactory } from "../../model/DAO/factory/AWSDAOFactory";

export const handler = async (request: PagedUserItemRequest<StatusDto>): Promise<PagedUserItemResponse<StatusDto>> => {
    const statusService = new StatusService(AWSDAOFactory.getInstance())
    const [items, hasMore] = await statusService.loadMoreFeedItems(request.token, request.userAlias, request.pageSize, request.lastItem)
    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}