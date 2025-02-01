import { Buffer } from "buffer";
import { User, AuthToken, FakeData } from "tweeter-shared";

export class UserService {
    public async login (alias: string, password: string): Promise<[User, AuthToken]>  {
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;
    
        if (user === null) {
          throw new Error("Invalid alias or password");
        }
    
        return [user, FakeData.instance.authToken];
    };

    public async register (firstName: string, lastName: string, alias: string, password: string, userImageBytes: string, imageFileExtension: string): Promise<[User, AuthToken]> {    
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;
    
        if (user === null) {
          throw new Error("Invalid registration");
        }
    
        return [user, FakeData.instance.authToken];
    };

    public async getIsFollowerStatus (authToken: string, user: User, selectedUser: User): Promise<boolean> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.isFollower();
    };

    public async getFolloweeCount (authToken: string, user: User): Promise<number> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.getFolloweeCount(user.alias);
    };

    public async getFollowerCount (authToken: string, user: User): Promise<number> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.getFollowerCount(user.alias);
    };

    public async follow (authToken: string, userToFollow: User): Promise<[followerCount: number, followeeCount: number]> {
      // Pause so we can see the follow message. Remove when connected to the server
      await new Promise((f) => setTimeout(f, 2000));
  
      // TODO: Call the server
  
      const followerCount = await this.getFollowerCount(authToken, userToFollow);
      const followeeCount = await this.getFolloweeCount(authToken, userToFollow);
  
      return [followerCount, followeeCount];
    };

    public async unfollow (authToken: string, userToUnfollow: User): Promise<[followerCount: number, followeeCount: number]> {
      // Pause so we can see the unfollow message. Remove when connected to the server
      await new Promise((f) => setTimeout(f, 2000));
  
      // TODO: Call the server
  
      const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
      const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);
  
      return [followerCount, followeeCount];
    };

    public async getUser (authToken: string, alias: string): Promise<User | null> {
      return FakeData.instance.findUserByAlias(alias);
    }

    
    public async logout (authToken: string): Promise<void> {
      // Pause so we can see the logging out message. Delete when the call to the server is implemented.
      await new Promise((res) => setTimeout(res, 1000));
    };
}