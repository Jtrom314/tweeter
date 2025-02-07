import { AuthToken, Status, FakeData, PagedUserItemRequest, StatusDto, PostStatusItemRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {
    private facade: ServerFacade;

    public constructor() {
      this.facade = new ServerFacade()
    }

    public async postStatus  (
        authToken: AuthToken,
        newStatus: Status
      ): Promise<void>{

        const request: PostStatusItemRequest = {
          token: authToken.token,
          status: newStatus.dto
        }

        await this.facade.postStatus(request)
      };
      
    public async loadMoreStoryItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]> {
        // TODO: Replace with the result of calling server
        const request: PagedUserItemRequest<StatusDto> = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem == null ? null : lastItem.dto
        }
        return this.facade.getMoreStoryItems(request);
      };
      
    public async loadMoreFeedItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]> {
        // TODO: Replace with the result of calling server
        const request: PagedUserItemRequest<StatusDto> = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem == null ? null : lastItem.dto
        }
        return this.facade.getMoreFeedItems(request)
      };
}