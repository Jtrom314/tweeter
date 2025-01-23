import { User } from "tweeter-shared"
import { View } from "./Presenter";
import { PagedItemPresenter } from "./PageItemPresenter";
import { FollowService } from "../model/service/followService";

export interface UserItemView extends View {
    addItems: (newItems: User[]) => void
}

export abstract class UserItemPresenter extends PagedItemPresenter<User, FollowService> {
    public constructor(view: UserItemView) {
        super(view)
    }

    protected createService(): FollowService {
        return new FollowService();
    } 
}