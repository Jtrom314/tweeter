import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/service/userService";

export interface arugments {
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtention?: string
}

export interface AuthenticateView extends View {
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void,
    navigate: NavigateFunction,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export abstract class AuthenticatePresenter<T extends AuthenticateView> extends Presenter<T> {
    private _service: UserService

    public constructor(view: T) {
        super(view)
        this._service = new UserService()
    }

    public async doAuthenticate (alias: string, password: string, rememberMe: boolean, destination: string | undefined, args: arugments = {}) {
        this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true)
            const [user, authToken] = await this.authenticate(alias, password, args)
            this.view.updateUserInfo(user, user, authToken, rememberMe)
            this.navigateTo(destination)
        }, this.getAuthenticationType())
        this.view.setIsLoading(false)
    }

    public get service () {
        return this._service
    }

    public abstract authenticate(alias: string, password: string, args: arugments): Promise<[User, AuthToken]>
    public abstract navigateTo(destination: string | undefined): void
    public abstract getAuthenticationType(): string
}