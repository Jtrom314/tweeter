import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/userService";
import { Presenter, View } from "./Presenter";

export interface NavBarView extends View {
    clearLastInfoMessage: () => void,
    clearUserInfo: () => void,
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void,
}

export class NavBarPresenter extends Presenter<NavBarView>{
    private userService: UserService

    public constructor(view: NavBarView) {
        super(view)
        this.userService = new UserService()
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