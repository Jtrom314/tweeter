import { AuthToken } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PageItemPresenter";


export class StoryPresenter extends StatusItemPresenter {
    public getItemDescription() {
        return 'load story items'
    }
    public async getMoreItems(authToken: AuthToken, userAlias: string) {
        return await this.service.loadMoreStoryItems(
            authToken!,
            userAlias,
            PAGE_SIZE,
            this.lastItem
        );
    }
}