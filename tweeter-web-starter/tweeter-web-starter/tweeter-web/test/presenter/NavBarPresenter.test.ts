import { AuthToken } from 'tweeter-shared'
import { NavBarPresenter, NavBarView} from '../../src/presenter/NavBarPresenter'
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito'
import { UserService } from '../../src/model/service/userService'

describe("NavBarPresenter", () => {
    let mockNavBarPresenterView: NavBarView;
    let navBarPresenter: NavBarPresenter;
    let mockUserService: UserService;


    const authToken = new AuthToken("test", Date.now());
    
    beforeEach(() => {
        mockNavBarPresenterView = mock<NavBarView>();
        const mockNavBarPresenterViewInstance = instance(mockNavBarPresenterView);
        
        const navBarSpy = spy(new NavBarPresenter(mockNavBarPresenterViewInstance));
        navBarPresenter = instance(navBarSpy);

        mockUserService = mock<UserService>();
        const mockUserServiceInstance = instance(mockUserService);

        when(navBarSpy.userService).thenReturn(mockUserServiceInstance);
    });

    it("tells the view to display a logging out message", async () => {
        await navBarPresenter.logout(authToken);

        verify(mockNavBarPresenterView.displayInfoMessage("Logging Out...", 0)).once();
    });

    it("calls logout on the user service with the correct auth token", async () => {
        await navBarPresenter.logout(authToken)

        verify(mockUserService.logout(authToken)).once()
        let [capturedAuthToken] = capture(mockUserService.logout).last()
        expect(capturedAuthToken).toEqual(authToken)
    })

    it("tells the view to clear the last info messagea and clears the user info when successful", async ()=> {
        await navBarPresenter.logout(authToken)

        verify(mockNavBarPresenterView.clearUserInfo()).once()
        verify(mockNavBarPresenterView.clearLastInfoMessage()).once()

        verify(mockNavBarPresenterView.displayErrorMessage(anything())).never()
    })

    it("displays an error message and does not clear the last info message and clear the user info when it fails", async () => {
        const error = new Error("An error occurred")
        when(mockUserService.logout(authToken)).thenThrow(error)

        await navBarPresenter.logout(authToken)

        verify(mockNavBarPresenterView.displayErrorMessage(`Failed to log user out because of exception: An error occurred`)).once()

        verify(mockNavBarPresenterView.clearUserInfo()).never()
        verify(mockNavBarPresenterView.clearLastInfoMessage()).never()
    })
})