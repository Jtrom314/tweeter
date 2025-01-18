import { AuthToken, User } from "tweeter-shared"

export interface UserItemView {
    addItems: (newItems: User[]) => void
    displayErrorMessage: (message: string) => void
}

export abstract class UserItemPresenter {
    private _hasMoreItems = true 
    private _lastItem: User | null = null;
    private _view: UserItemView

    reset() {
        this._lastItem = null
        this._hasMoreItems = true
    }

    protected constructor(view: UserItemView) {
        this._view = view
    }

    public get hasMoreItems() {
        return this._hasMoreItems
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value
    }

    protected get lastItem() {
        return this._lastItem;
    }

    protected set lastItem(value: User | null) {
        this._lastItem = value
    }

    protected get view() {
        return this._view
    }

    public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void
}