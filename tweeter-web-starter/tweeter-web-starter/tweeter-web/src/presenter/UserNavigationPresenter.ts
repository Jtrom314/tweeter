import { AuthToken, User } from "tweeter-shared"
import { UserService } from "../model/service/userService"

export interface UserNavigationView {
    setDisplayedUser: (user: User) => void,
    displayErrorMessage: (message: string, bootstrapClasses?: string) => void
}

export class UserNavigationClass {
    private view: UserNavigationView
    private userService: UserService

    public constructor (view: UserNavigationView) {
        this.view = view
        this.userService = new UserService()
    }

    public extractAlias (value: string): string {
        const index = value.indexOf('@');
        return value.substring(index);
    }

    public async navigateToUser (postString: string, authToken: AuthToken, currentUser: User) {
        try {
            const alias = this.extractAlias(postString)
            const user = await this.userService.getUser(authToken, alias)

            if (!!user) {
                if (currentUser!.equals(user)) {
                    this.view.setDisplayedUser(currentUser!)
                } else {
                    this.view.setDisplayedUser(user)
                }
            }

        } catch (error) {
            this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`)
        }
    }
}