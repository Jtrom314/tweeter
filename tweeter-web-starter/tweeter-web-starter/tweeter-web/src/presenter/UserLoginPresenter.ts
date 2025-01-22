import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/userService";
import { NavigateFunction } from "react-router-dom";
import { Presenter, View } from "./Presenter";

export interface UserLoginView extends View {
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void,
    navigate: NavigateFunction
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export class UserLoginPresenter extends Presenter<UserLoginView> {
    private userService: UserService;


    public constructor(view: UserLoginView) {
        super(view)
        this.userService = new UserService()
    }

    public async doLogin (alias: string, password: string, originalUrl: string | undefined, rememberMe: boolean) {
        this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true)
            const [user, authToken] = await this.userService.login(alias, password);
            this.view.updateUserInfo(user, user, authToken, rememberMe)
            if (!!originalUrl) {
                this.view.navigate(originalUrl)
            } else {
                this.view.navigate("/")
            }
        }, 'log user in')
        this.view.setIsLoading(false)
    };
}