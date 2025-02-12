import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { DataPage } from "../DAO/implementation/DAOImplementation";
import { Service } from "./Service";

export class FollowService extends Service {
      public async loadMoreFollowers (
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        // return this.getFakeData(lastItem, pageSize, userAlias);
        return await this.validatedOperation<[UserDto[], boolean]>(authToken, async () => {
          return await this.getPagedFollowers(lastItem, pageSize, userAlias)
        })
      };
      
      public async loadMoreFollowees (
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        // return this.getFakeData(lastItem, pageSize, userAlias);
        return await this.validatedOperation<[UserDto[], boolean]>(authToken, async () => {
          return await this.getPagedFollowees(lastItem, pageSize, userAlias)
        })
      };

      private async getPagedFollowers(lastItem: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
        const dataPage: DataPage<string> = await this.followDAO.getPageOfFollowers(userAlias, pageSize, lastItem?.alias)
        const hasMore = dataPage.hasMorePages
        const items = dataPage.values
        const users: UserDto[] = []
        for (let i = 0; i < items.length; i++) {
          const alias = items[i]
          const user = await this.userDAO.getUserByAlias(alias)
          users.push(user?.dto!)
        }
        return [users, hasMore]
      }

      private async getPagedFollowees(lastItem: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
        const dataPage: DataPage<string> = await this.followDAO.getPageOfFollowees(userAlias, pageSize, lastItem?.alias)
        const hasMore = dataPage.hasMorePages
        const items = dataPage.values
        const users: UserDto[] = []
        for (let i = 0; i < items.length; i++) {
          const alias = items[i]
          const user = await this.userDAO.getUserByAlias(alias)
          users.push(user?.dto!)
        }

        return [users, hasMore]
      }


      private async getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
        const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
        const dtos = items.map((user: User) => user.dto);
        return [dtos, hasMore];
      }

}