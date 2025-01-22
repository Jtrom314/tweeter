import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/userService";
import { NavigateFunction } from "react-router-dom";

export interface UserLoginView {
    displayErrorMessage: (message: string) => void,
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void,
    navigate: NavigateFunction
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export class UserLoginPresenter {
    private userService: UserService;
    private view: UserLoginView


    public constructor(view: UserLoginView) {
        this.view = view
        this.userService = new UserService()
    }

    public async doLogin (alias: string, password: string, originalUrl: string | undefined, rememberMe: boolean) {
        try {
            this.view.setIsLoading(true)
            const [user, authToken] = await this.userService.login(alias, password);
            this.view.updateUserInfo(user, user, authToken, rememberMe)
            if (!!originalUrl) {
                this.view.navigate(originalUrl)
            } else {
                this.view.navigate("/")
            }
        } catch (error) {
            this.view.displayErrorMessage(`Failed to log user in because of exception: ${error}`)
        } finally {
            this.view.setIsLoading(false)
        }
    };
}