import { AuthToken, User } from "tweeter-shared"
import { UserService } from "../model/service/userService"
import { Presenter, View } from "./Presenter"

export interface UserNavigationView extends View {
    setDisplayedUser: (user: User) => void
}

export class UserNavigationClass extends Presenter<UserNavigationView> {
    private userService: UserService

    public constructor (view: UserNavigationView) {
        super(view)
        this.userService = new UserService()
    }

    public extractAlias (value: string): string {
        const index = value.indexOf('@');
        return value.substring(index);
    }

    public async navigateToUser (postString: string, authToken: AuthToken, currentUser: User) {
        this.doFailureReportingOperation(async () => {
            const alias = this.extractAlias(postString)
            const user = await this.userService.getUser(authToken, alias)
    
            if (!!user) {
                if (currentUser!.equals(user)) {
                    this.view.setDisplayedUser(currentUser!)
                } else {
                    this.view.setDisplayedUser(user)
                }
            }
        }, 'get user')
    }
}