import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/statusService";
import { Presenter, View } from "./Presenter";

export interface PostStatusView extends View {
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void,
    clearLastInfoMessage: () => void,
    setPost: React.Dispatch<React.SetStateAction<string>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
    private statusService: StatusService

    public constructor(view: PostStatusView) {
        super(view)
        this.statusService = new StatusService()
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