import { AuthToken, Status, FakeData, PagedUserItemRequest, StatusDto } from "tweeter-shared";
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
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server to post the status
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
          lastItem: lastItem
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
        return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
      };
}