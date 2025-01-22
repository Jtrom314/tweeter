import { AuthToken } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PageItemPresenter";


export class FeedPresenter extends StatusItemPresenter {
    public getItemDescription() {
        return 'load feed'
    }
    public async getMoreItems(authToken: AuthToken, userAlias: string) {
        return await this.service.loadMoreFeedItems(
            authToken!,
            userAlias,
            PAGE_SIZE,
            this.lastItem
        );
    }
}