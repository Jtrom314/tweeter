import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/statusService";

export interface PostStatusView {
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void,
    displayErrorMessage: (message: string, bootstrapClasses?: string) => void,
    clearLastInfoMessage: () => void,
    setPost: React.Dispatch<React.SetStateAction<string>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export class PostStatusPresenter {
    private statusService: StatusService
    private view: PostStatusView

    public constructor(view: PostStatusView) {
        this.statusService = new StatusService()
        this.view = view
    }

    public async submitPost (post: string, currentUser: User, authToken: AuthToken) {
        try {
            this.view.displayInfoMessage("Posting status...", 0);
            const status = new Status(post, currentUser!, Date.now());
            
            await this.statusService.postStatus(authToken!, status);
            
            this.view.setPost("")
            this.view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
          this.view.displayErrorMessage(`Failed to post the status because of exception: ${error}`);
        } finally {
          this.view.clearLastInfoMessage();
          this.view.setIsLoading(false);
        }
    }
}