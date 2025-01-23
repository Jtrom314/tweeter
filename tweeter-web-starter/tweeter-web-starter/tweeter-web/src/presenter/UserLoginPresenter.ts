import { AuthToken, User } from "tweeter-shared";
import { AuthenticatePresenter, AuthenticateView } from "./AuthenticatePresenter";

export class UserLoginPresenter extends AuthenticatePresenter<AuthenticateView> {
    public async doLogin (alias: string, password: string, rememberMe: boolean, originalUrl: string | undefined) {
        this.doAuthenticate(alias, password, rememberMe, originalUrl)
    };
    public async authenticate(alias: string, password: string): Promise<[User, AuthToken]> {
        return await this.service.login(alias, password)
    }
    public navigateTo(destination: string | undefined): void {
        if (!!destination) {
            this.view.navigate(destination)
        } else {
            this.view.navigate("/")
        }
    }
    public getAuthenticationType(): string {
        return 'log in user'
    }
}