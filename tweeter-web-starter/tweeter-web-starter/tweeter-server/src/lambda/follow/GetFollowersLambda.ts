import { PagedUserItemRequest, PagedUserItemResponse, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/followService";
import { AWSDAOFactory } from "../../model/DAO/factory/AWSDAOFactory";

export const handler = async (request: PagedUserItemRequest<UserDto>): Promise<PagedUserItemResponse<UserDto>> => {
    const followService = new FollowService(AWSDAOFactory.getInstance())
    const [items, hasMore] = await followService.loadMoreFollowers(request.token, request.userAlias, request.pageSize, request.lastItem)
    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}