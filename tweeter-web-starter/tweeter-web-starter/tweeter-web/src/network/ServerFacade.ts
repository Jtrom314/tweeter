import { AuthResponse, AuthToken, BoolResponse, DualNumberResponse, GeneralUserRequest, GetUserRequest, GetUserResponse, LoginRequest, PagedUserItemRequest, PagedUserItemResponse, PostStatusItemRequest, Status, StatusDto, TweeterRequest, TweeterResponse, User, UserDto, UserFolloweeFollowerResponse } from "tweeter-shared"
import { ClientCommunicator } from "./ClientCommunicator"

export class ServerFacade {
    private SERVER_URL = "https://4fnyxwtjtd.execute-api.us-east-1.amazonaws.com/dev"
    private clientCommunicator = new ClientCommunicator(this.SERVER_URL)

    public async loginUser(request: LoginRequest): Promise<[User, AuthToken]> {
        const response = await this.clientCommunicator.doPost<LoginRequest, AuthResponse>(request, "/user/login")

        const user = response.success && response.user != null ? User.fromDto(response.user) : null
        const authToken = response.success && response.authToken != null ? AuthToken.fromDto(response.authToken) : null

        if (response.success) {
            if (user == null || authToken == null) {
                throw new Error('User or Authtoken not found')
            } else {
                return [user, authToken]
            }
        } else {
            console.error(response)
            throw new Error(response.message!)
        }
    }

    public async getIsFollowerStatus(request: GeneralUserRequest): Promise<boolean> {
        const response = await this.clientCommunicator.doPost<GeneralUserRequest, BoolResponse>(request, "/user/getIsFollowerStatus")

        if (response.success) {
            return response.booleanValue
        } else {
            console.error(response)
            throw new Error(response.message!)
        }
    }

    public async unfollowUser(request: GeneralUserRequest): Promise<[number, number]> {
        const response = await this.clientCommunicator.doPost<GeneralUserRequest, DualNumberResponse>(request, "/user/unfollow")

        if (response.success) {
            return [response.followerCount, response.followeeCount]
        } else {
            console.error(response)
            throw new Error(response.message!)
        }
    }

    public async followUser(request: GeneralUserRequest): Promise<[number, number]> {
        const response = await this.clientCommunicator.doPost<GeneralUserRequest, DualNumberResponse>(request, "/user/follow")

        if (response.success) {
            return [response.followerCount, response.followeeCount]
        } else {
            console.error(response)
            throw new Error(response.message!)
        }
    }

    public async getFollowerCount(request: GeneralUserRequest): Promise<number> {
        const response = await this.clientCommunicator.doPost<GeneralUserRequest, UserFolloweeFollowerResponse>(request, "/user/getFollowerCount")

        if (response.success) {
            return response.followNumber
        } else {
            console.error(response)
            throw new Error(response.message!)
        }
    }

    public async getFolloweeCount(request: GeneralUserRequest): Promise<number> {
        const response = await this.clientCommunicator.doPost<GeneralUserRequest, UserFolloweeFollowerResponse>(request, "/user/getFolloweeCount")

        if (response.success) {
            return response.followNumber
        } else {
            console.error(response)
            throw new Error(response.message!)
        }
    }

    public async getUser(request: GetUserRequest): Promise<User | null> {
        const response = await this.clientCommunicator.doPost<GetUserRequest, GetUserResponse>(request, "/user/getUser")

        const user: User | null = response.success && response.userDto ? User.fromDto(response.userDto) : null

        if (response.success) {
            return user
        } else {
            console.error(response)
            throw new Error(response.message!)
        }
    }

    public async logoutUser(request: TweeterRequest): Promise<void> {
        const response = await this.clientCommunicator.doPost<TweeterRequest, TweeterResponse>(request, "/user/logout")

        if (response.success) {
            return
        } else {
            console.error(response)
            throw new Error(response.message!)
        }
    }

    public async postStatus(request: PostStatusItemRequest): Promise<void> {
        const response = await this.clientCommunicator.doPost<PostStatusItemRequest, TweeterResponse>(request, "/status/post")

        if (response.success) {
            return
        } else {
            console.error(response)
            throw new Error(response.message!)
        }
    }

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