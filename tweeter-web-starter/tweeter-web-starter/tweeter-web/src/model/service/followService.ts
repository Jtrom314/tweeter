import { AuthToken, User, FakeData } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";
import { PagedUserItemRequest } from "tweeter-shared";

export class FollowService {
      private facade: ServerFacade;
  
      public constructor() {
        this.facade = new ServerFacade()
      }

      public async loadMoreFollowers (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        const request: PagedUserItemRequest = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem == null ? null : lastItem.dto
        }
        return this.facade.getMoreFollowers(request);
      };
      
      public async loadMoreFollowees (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        const request: PagedUserItemRequest = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem == null ? null : lastItem.dto
        }
        return this.facade.getMoreFollowees(request);
      };
}