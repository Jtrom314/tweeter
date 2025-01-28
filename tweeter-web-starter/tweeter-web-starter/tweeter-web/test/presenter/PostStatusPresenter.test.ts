import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';
import { StatusService } from '../../src/model/service/statusService';
import { PostStatusPresenter, PostStatusView } from '../../src/presenter/PostStatusPresenter'
import { AuthToken, Status, User } from 'tweeter-shared';


describe("PostStatusPresenter", () => {
    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockStatusService: StatusService

    const user = new User("test", "test", "@test", "test")
    const authToken = new AuthToken("test", Date.now())
    const post = "test"

    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>()
        const mockPostStatusViewInstance = instance(mockPostStatusView)

        const postStatusSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance))
        postStatusPresenter = instance(postStatusSpy)

        mockStatusService = mock<StatusService>()
        const mockStatusServiceInstance = instance(mockStatusService)

        when(postStatusSpy.statusService).thenReturn(mockStatusServiceInstance)
    })

    it("tells the view to display a posting status message", async () => {
        await postStatusPresenter.submitPost(post, user, authToken)

        verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once()
    })

    it("calls postStatus on the post status service with the correct status string and auth token", async() => {
        await postStatusPresenter.submitPost(post, user, authToken)
        verify(mockStatusService.postStatus(authToken, anything())).once()


        let [capturedAuthToken] = capture(mockStatusService.postStatus).first()
        expect(authToken).toEqual(capturedAuthToken)
    })

    it("tells the view to clear the last info message, clear the post, and display a status posted message when successful", async () => {
        await postStatusPresenter.submitPost(post, user, authToken)
        
        verify(mockPostStatusView.clearLastInfoMessage()).once()
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once()
        verify(mockPostStatusView.setPost("")).once()

        verify(mockPostStatusView.displayErrorMessage(anything())).never()
    })

    it("tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message", async () => {
        const error = new Error("An error occurred")
        when(mockStatusService.postStatus(authToken, anything())).thenThrow(error)

        await postStatusPresenter.submitPost(post, user, authToken)

        verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: An error occurred")).once()

        verify(mockPostStatusView.clearLastInfoMessage()).once()
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never()
        verify(mockPostStatusView.setPost("")).never()
    })
})