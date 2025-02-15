import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/userService";
import { DisplayLoadingView, Presenter } from "./Presenter";

export interface UserInfoView extends DisplayLoadingView {
    setIsFollower: React.Dispatch<React.SetStateAction<boolean>>,
    setFolloweeCount: React.Dispatch<React.SetStateAction<number>>,
    setFollowerCount: React.Dispatch<React.SetStateAction<number>>,
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
    private userService: UserService

    public constructor(view: UserInfoView) {
        super(view)
        this.userService = new UserService()
    }

    public async setIsFollowerStatus (authToken: AuthToken, currentUser: User, displayedUser: User) {
      this.doFailureReportingOperation(async () => {
        if (currentUser === displayedUser) {
          this.view.setIsFollower(false);
        } else {
          this.view.setIsFollower(
            await this.userService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
          );
        }
      }, 'determine follower status')
    }

    public async setNumbFollowees (authToken: AuthToken, displayedUser: User) {
      this.doFailureReportingOperation(async () => {
        this.view.setFolloweeCount(await this.userService.getFolloweeCount(authToken, displayedUser));
      }, 'get followeees count')
    }

    public async setNumbFollowers (authToken: AuthToken, displayedUser: User) {
      this.doFailureReportingOperation(async () => {
        this.view.setFollowerCount(await this.userService.getFollowerCount(authToken, displayedUser));
      }, 'get followers count')
    }

    public async followDisplayedUser (displayedUser: User, authToken: AuthToken) {
      this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);
        this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);
  
        const [followerCount, followeeCount] = await this.userService.follow(
          authToken!,
          displayedUser!
        );
  
        this.view.setIsFollower(true);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      }, 'follow user')
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }

    public async unfollowDisplayedUser (displayedUser: User, authToken: AuthToken) {
      this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);
        this.view.displayInfoMessage(`Unfollowing ${displayedUser!.name}...`,0);
  
        const [followerCount, followeeCount] = await this.userService.unfollow(
          authToken!,
          displayedUser!
        );
  
        this.view.setIsFollower(false);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      }, 'unfollow user')
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
}