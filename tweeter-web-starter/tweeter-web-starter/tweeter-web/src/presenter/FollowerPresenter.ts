import { AuthToken } from "tweeter-shared";
import { UserItemPresenter} from "./UserItemPresenter";
import { PAGE_SIZE } from "./PageItemPresenter";

export class FollowerPresenter extends UserItemPresenter {
    public getItemDescription() {
        return 'load followers'
    }
    public async getMoreItems(authToken: AuthToken, userAlias: string) {
        return await this.service.loadMoreFollowers(
            authToken!,
            userAlias,
            PAGE_SIZE,
            this.lastItem
        );
    }
}