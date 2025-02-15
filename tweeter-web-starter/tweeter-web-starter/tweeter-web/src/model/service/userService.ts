import { Buffer } from "buffer";
import { User, AuthToken, FakeData, TweeterRequest, GetUserRequest, GeneralUserRequest, LoginRequest, RegisterRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
    private facade: ServerFacade;

    public constructor() {
      this.facade = new ServerFacade()
    }

    public async login (alias: string, password: string): Promise<[User, AuthToken]>  {
        const request: LoginRequest = {
          alias,
          password
        }

        return this.facade.loginUser(request)
    };

    public async register (firstName: string, lastName: string, alias: string, password: string, userImageBytes: Uint8Array, imageFileExtension: string): Promise<[User, AuthToken]> {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        const imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");

        const request: RegisterRequest = {
          firstName,
          lastName,
          alias,
          password,
          imageFileExtension,
          userImageBytes: imageStringBase64
        }
    
        return this.facade.register(request)
    };

    public async getIsFollowerStatus (authToken: AuthToken, user: User, selectedUser: User): Promise<boolean> {
      // TODO: Replace with the result of calling server
      const request: GeneralUserRequest = {
        token: authToken.token,
        user: user.dto,
        addtionalUser: selectedUser.dto
      }
      return this.facade.getIsFollowerStatus(request)
    };

    public async getFolloweeCount (authToken: AuthToken, user: User): Promise<number> {
      // TODO: Replace with the result of calling server
      const request: GeneralUserRequest = {
        token: authToken.token,
        user: user.dto
      }
      return this.facade.getFolloweeCount(request)
    };

    public async getFollowerCount (authToken: AuthToken, user: User): Promise<number> {
      // TODO: Replace with the result of calling server
      const request: GeneralUserRequest = {
        token: authToken.token,
        user: user.dto
      }
      return this.facade.getFollowerCount(request)
    };

    public async follow (authToken: AuthToken, userToFollow: User): Promise<[followerCount: number, followeeCount: number]> {
      const request: GeneralUserRequest = {
        token: authToken.token,
        user: userToFollow.dto
      }
  
      return this.facade.followUser(request)
    };

    public async unfollow (authToken: AuthToken, userToUnfollow: User): Promise<[followerCount: number, followeeCount: number]> {
      const request: GeneralUserRequest = {
        token: authToken.token,
        user: userToUnfollow.dto
      }
  
      return this.facade.unfollowUser(request)
    };

    public async getUser (authToken: AuthToken, alias: string): Promise<User | null> {
      const request: GetUserRequest = {
        token: authToken.token,
        userAlias: alias
      }

      return this.facade.getUser(request)
    }

    
    public async logout (authToken: AuthToken): Promise<void> {
      const request: TweeterRequest = {
        token: authToken.token
      }
      await this.facade.logoutUser(request)
    };
}