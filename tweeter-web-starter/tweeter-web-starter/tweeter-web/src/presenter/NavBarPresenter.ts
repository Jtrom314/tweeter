import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/userService";

export interface NavBarView {
    clearLastInfoMessage: () => void,
    clearUserInfo: () => void,
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void,
    displayErrorMessage: (message: string, bootstrapClasses?: string) => void
}

export class NavBarPresenter {
    private userService: UserService
    private view: NavBarView

    public constructor(view: NavBarView) {
        this.view = view
        this.userService = new UserService()
    }

    public async logout (authToken: AuthToken) {
        this.view.displayInfoMessage("Logging Out...", 0)
        try {
            await this.userService.logout(authToken!)
            this.view.clearLastInfoMessage()
            this.view.clearUserInfo()
        } catch (error) {
            this.view.displayErrorMessage(`Failed to log user out because of exception: ${error}`)
        }
    }

}