import { User, AuthToken, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import * as bcrypt from "bcryptjs"

export class UserService extends Service {

    private async hashPassword (password: string): Promise<string> {
      const saltRounds = 10
      return await bcrypt.hash(password, saltRounds)
    }
    
    public async login (alias: string, password: string): Promise<[User, AuthToken]>  {
        // TODO: Replace with the result of calling the server
        // const user = FakeData.instance.firstUser;
    
        // if (user === null) {
        //   throw new Error("Invalid alias or password");
        // }
    
        // return [user, FakeData.instance.authToken];

        const user: User | null = await this.userDAO.getUserByAliasPassword(alias, password)

        if (user == null) {
          throw new Error("Invalid alias or password")
        }

        const authToken = await this.authDAO.createAuth(user)

        return [user, authToken]
    };

    public async register (firstName: string, lastName: string, alias: string, password: string, userImageBytes: string, imageFileExtension: string): Promise<[User, AuthToken]> {    
        // TODO: Replace with the result of calling the server
        // const user = FakeData.instance.firstUser;
    
        // if (user === null) {
        //   throw new Error("Invalid registration");
        // }
    
        // return [user, FakeData.instance.authToken];

        const dbUser = await this.userDAO.getUserByAlias(alias)

        if (dbUser !== null) {
          throw new Error("Invalid registration")
        }
        const profilePictureExtention = await this.s3DAO.createImageReference(userImageBytes, imageFileExtension)
        const user = await this.userDAO.createUser(firstName, lastName, alias, await this.hashPassword(password), profilePictureExtention)

        const authToken = await this.authDAO.createAuth(user)
        return [user, authToken]
    };

    public async getIsFollowerStatus (authToken: string, user: User, selectedUser: User): Promise<boolean> {
      // TODO: Replace with the result of calling server
      // return FakeData.instance.isFollower();
      return await this.validatedOperation<boolean>(authToken, async() => {
        return await this.followDAO.getIsFollower(user, selectedUser)
      })
    };

    public async getFolloweeCount (authToken: string, alias: string): Promise<number> {
      // TODO: Replace with the result of calling server
      // return FakeData.instance.getFolloweeCount(user.alias);
      return await this.validatedOperation<number>(authToken, async () => {
        return await this.userDAO.getFolloweeCount(alias)
      })
    };

    public async getFollowerCount (authToken: string, alias: string): Promise<number> {
      // TODO: Replace with the result of calling server
      // return FakeData.instance.getFollowerCount(user.alias);
      return await this.validatedOperation<number>(authToken, async () => {
        return await this.userDAO.getFollowerCount(alias)
      })
    };

    public async follow (authToken: string, userToFollow: User): Promise<[followerCount: number, followeeCount: number]> {
      // Pause so we can see the follow message. Remove when connected to the server
      // await new Promise((f) => setTimeout(f, 2000));
  
      // TODO: Call the server

      // Talk through the logic of this with Layton
      const baseUserAlias = await this.authDAO.getAliasByAuth(authToken)

      await this.userDAO.updateFollowerCount(userToFollow.alias, 1)
      await this.userDAO.updateFolloweeCount(baseUserAlias!, 1)

      const followerCount = await this.getFollowerCount(authToken, userToFollow.alias);
      const followeeCount = await this.getFolloweeCount(authToken, userToFollow.alias);
  
      return [followerCount, followeeCount];
    };

    public async unfollow (authToken: string, userToUnfollow: User): Promise<[followerCount: number, followeeCount: number]> {
      // Pause so we can see the unfollow message. Remove when connected to the server
      // await new Promise((f) => setTimeout(f, 2000));
  
      // TODO: Call the server

      const baseUserAlias = await this.authDAO.getAliasByAuth(authToken)

      await this.userDAO.updateFollowerCount(userToUnfollow.alias, -1)
      await this.userDAO.updateFolloweeCount(baseUserAlias!, -1)
  
      const followerCount = await this.getFollowerCount(authToken, userToUnfollow.alias);
      const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow.alias);
  
      return [followerCount, followeeCount];
    };

    public async getUser (authToken: string, alias: string): Promise<User | null> {
      // return FakeData.instance.findUserByAlias(alias);
      return await this.validatedOperation<User | null>(authToken, async () => {
        return await this.userDAO.getUserByAlias(alias)
      })
    }

    
    public async logout (authToken: string): Promise<void> {
      // Pause so we can see the logging out message. Delete when the call to the server is implemented.
      // await new Promise((res) => setTimeout(res, 1000));
      await this.authDAO.deleteAuth(authToken)
    };
}