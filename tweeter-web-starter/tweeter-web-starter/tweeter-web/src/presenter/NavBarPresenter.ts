import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/userService";
import { DisplayView, Presenter } from "./Presenter";

export interface NavBarView extends DisplayView {
    clearUserInfo: () => void,
}

export class NavBarPresenter extends Presenter<NavBarView>{
    private _userService: UserService | null = null

    public constructor(view: NavBarView) {
        super(view)
        this._userService = this.userService
    }

    public get userService() {
        if (this._userService == null) {
            this._userService = new UserService()   
        } 
        return this._userService
    }

    public async logout (authToken: AuthToken) {
        this.doFailureReportingOperation(async () => {
            this.view.displayInfoMessage("Logging Out...", 0)
            await this.userService.logout(authToken!)
            this.view.clearLastInfoMessage()
            this.view.clearUserInfo()
        }, 'log user out')
    }

}