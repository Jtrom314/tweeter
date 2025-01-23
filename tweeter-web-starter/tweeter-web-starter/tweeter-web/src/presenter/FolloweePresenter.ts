import { AuthToken } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PageItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
    public getItemDescription() {
        return 'load followees'
    }
    public async getMoreItems(authToken: AuthToken, userAlias: string) {
        return await this.service.loadMoreFollowees(
            authToken!,
            userAlias,
            PAGE_SIZE,
            this.lastItem
        );
    }
}