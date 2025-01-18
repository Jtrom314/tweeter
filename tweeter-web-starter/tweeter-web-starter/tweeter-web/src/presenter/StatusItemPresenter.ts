import { AuthToken, Status, User } from "tweeter-shared"

export interface StatusItemView {
    addItems: (newItems: Status[]) => void
    displayErrorMessage: (message: string) => void
}

export abstract class StatusItemPresenter {
    private _view: StatusItemView
    private _lastItem: Status | null = null
    private _hasMoreItems = true

    protected constructor(view: StatusItemView) {
        this._view = view
    }

    public get hasMoreItems() {
        return this._hasMoreItems
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value
    }

    protected get lastItem() {
        return this._lastItem
    }

    protected set lastItem(value: Status | null) {
        this._lastItem = value
    }

    protected get view() {
        return this._view
    }

    reset() {
        this._lastItem = null
        this._hasMoreItems = true
    }

    public abstract loadMoreItems (authToken: AuthToken, userAlias: string): void
}