import { PagedUserItemRequest, PagedUserItemResponse, Status, StatusDto, User, UserDto } from "tweeter-shared"
import { ClientCommunicator } from "./ClientCommunicator"

export class ServerFacade {
    private SERVER_URL = "https://4fnyxwtjtd.execute-api.us-east-1.amazonaws.com/dev"
    private clientCommunicator = new ClientCommunicator(this.SERVER_URL)

    public async getMoreFeedItems(request: PagedUserItemRequest<StatusDto>): Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.doPost<PagedUserItemRequest<StatusDto>, PagedUserItemResponse<StatusDto>>(request, "/feed/list")

        const items: Status[] | null = response.success && response.items ? response.items.map((dto) => Status.fromDto(dto) as Status) : null

        if (response.success) {
            if (items == null) {
                throw new Error('No Feed Items found')
            } else {
                return [items, response.hasMore]
            }
        } else {
            console.error(response)
            throw new Error(response.message!)
        }
    }

    public async getMoreStoryItems(request: PagedUserItemRequest<StatusDto>): Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.doPost<PagedUserItemRequest<StatusDto>, PagedUserItemResponse<StatusDto>>(request, "/story/list")

        const items: Status[] | null = response.success && response.items ? response.items.map((dto) => Status.fromDto(dto) as Status) : null

        if (response.success) {
            if (items == null) {
                throw new Error('No Story Items found')
            } else {
                return [items, response.hasMore]
            }
        } else {
            console.error(response)
            throw new Error(response.message!)
        }
    }

    public async getMoreFollowers(request: PagedUserItemRequest<UserDto>): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.doPost<PagedUserItemRequest<UserDto>, PagedUserItemResponse<UserDto>>(request, "/follower/list")

        const items: User[] | null = response.success && response.items ? response.items.map((dto) => User.fromDto(dto) as User) : null

        if (response.success) {
            if (items == null) {
                throw new Error('No followers found')
            } else {
                return [items, response.hasMore]
            }
        } else {
            console.error(response)
            throw new Error(response.message!)
        }
    }

    public async getMoreFollowees(request: PagedUserItemRequest<UserDto>): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.doPost<PagedUserItemRequest<UserDto>, PagedUserItemResponse<UserDto>>(request, "/followee/list")

        const items: User[] | null = response.success && response.items ? response.items.map((dto) => User.fromDto(dto) as User) : null

        if (response.success) {
            if (items == null) {
                throw new Error('No followees found')
            } else {
                return [items, response.hasMore]
            }
        } else {
            console.error(response)
            throw new Error(response.message!)
        }
    }
}