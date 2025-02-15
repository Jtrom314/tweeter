import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/statusService";
import { DisplayLoadingView, Presenter } from "./Presenter";

export interface PostStatusView extends DisplayLoadingView {
    setPost: React.Dispatch<React.SetStateAction<string>>,
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
    private _statusService: StatusService | null = null

    public constructor(view: PostStatusView) {
        super(view)
        this._statusService = this.statusService
    }

    public get statusService() {
        if (this._statusService == null) {
            this._statusService = new StatusService()
        }
        return this._statusService
    }

    public async submitPost (post: string, currentUser: User, authToken: AuthToken) {
        this.doFailureReportingOperation(async () => {
            this.view.displayInfoMessage("Posting status...", 0);
            const status = new Status(post, currentUser!, Date.now());
            
            await this.statusService.postStatus(authToken!, status);
            
            this.view.setPost("")
            this.view.displayInfoMessage("Status posted!", 2000);
        }, 'post the status')
       
        this.view.clearLastInfoMessage();
        this.view.setIsLoading(false);
    }
}