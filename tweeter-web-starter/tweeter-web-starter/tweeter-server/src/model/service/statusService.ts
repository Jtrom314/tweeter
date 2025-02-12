import { Status, FakeData, StatusDto, User } from "tweeter-shared";
import { Service } from "./Service";
import { DataPage } from "../DAO/implementation/DAOImplementation";
import { StoryDTO } from "../DAO/interfaces/StoryDAO";

export class StatusService extends Service {
    public async postStatus  (
        authToken: string,
        newStatus: StatusDto
      ): Promise<void>{
        // Pause so we can see the logging out message. Remove when connected to the server
        // await new Promise((f) => setTimeout(f, 2000));
        await this.validatedOperation<void>(authToken, async () => {
          await this.storyDAO.createStoryItem(newStatus)
        })
      };
      
    public async loadMoreStoryItems (
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
      ): Promise<[StatusDto[], boolean]> {
        // TODO: Replace with the result of calling server
        // return this.getFakeData(lastItem, pageSize)
        return await this.validatedOperation<[StatusDto[], boolean]>(authToken, async () => {
          return await this.getMoreStoryItems(userAlias, pageSize, lastItem)  
        })
      };
      
    public async loadMoreFeedItems (
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
      ): Promise<[StatusDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize)
      };

      private async getMoreStoryItems(userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]> {
        const dataPage: DataPage<StoryDTO> = await this.storyDAO.getPageOfStoryItems(userAlias, pageSize, lastItem?.timestamp)
        const hasMore = dataPage.hasMorePages
        const items = dataPage.values
        const status: StatusDto[] = []
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          const user: User | null = await this.userDAO.getUserByAlias(userAlias)
          const statusItem = new Status(item.post, user!, item.timestamp)
          status.push(statusItem.dto!)
        }

        return [status, hasMore]
      }

      private async getFakeData(lastItem: StatusDto | null, pageSize: number): Promise<[StatusDto[], boolean]> {
        const [items, hasMore ] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
        const dtos = items.map((status: Status) => status.dto);
        return [dtos, hasMore];
      }
}