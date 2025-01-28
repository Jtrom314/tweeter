import React from "react"
import PostStatus from '../../../src/components/postStatus/PostStatus'
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { instance, mock, verify } from 'ts-mockito'
import { AuthToken, User } from "tweeter-shared"
import useUserInfo from "../../../src/components/userInfo/UserInfoHook"
import "@testing-library/jest-dom"
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter"

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
    ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
    __esModule: true,
    default: jest.fn(),
}));      


describe("Post Status Tests", () => {
    let mockUserInstance: User | null = null
    let mockAuthTokenInstance: AuthToken | null = null
    const text = 'test'

    beforeAll(() => {
        const mockUser = mock<User>()
        mockUserInstance = instance(mockUser);
        
        const mockAuthToken  = mock<AuthToken>()
        mockAuthTokenInstance = instance(mockAuthToken);

        (useUserInfo as jest.Mock).mockReturnValue({
            currentUser: mockUserInstance,
            authToken: mockAuthTokenInstance,
          });      
    })

    it("should have post status and clear buttons disabled on initial render", () => {
        const {clearButton, postButton} = renderPostStatusAndGetElement()
        expect(clearButton).toBeDisabled()
        expect(postButton).toBeDisabled()
    })

    it("should have both buttons enabled when the text field has text", async () => {
        const {userAction, textArea, clearButton, postButton} = renderPostStatusAndGetElement()
        expect(clearButton).toBeDisabled()
        expect(postButton).toBeDisabled()

        await userAction.type(textArea, text)

        expect(clearButton).toBeEnabled()
        expect(postButton).toBeEnabled()
    })

    it("should have both buttons disabled when the text field is cleared", async () => {
        const {userAction, textArea, clearButton, postButton} = renderPostStatusAndGetElement()
        await userAction.type(textArea, text)

        expect(clearButton).toBeEnabled()
        expect(postButton).toBeEnabled()

        await userAction.click(clearButton)

        expect(clearButton).toBeDisabled()
        expect(postButton).toBeDisabled()
    })

    it("calls the presenters postStatus method with correct parameters when the post status button is pressed", async () => {
        const mockPresenter = mock<PostStatusPresenter>()
        const mockPresenterInstacne = instance(mockPresenter);

        const {userAction, textArea, postButton} = renderPostStatusAndGetElement(mockPresenterInstacne)

        await userAction.type(textArea, text)
        await userAction.click(postButton)

        verify(mockPresenter.submitPost(text, mockUserInstance!, mockAuthTokenInstance!)).once()
    })
})

const renderPostStatus = (presenter?: PostStatusPresenter) => {
    return render(
        <MemoryRouter>
            {
                !!presenter ?
                (
                    <PostStatus presenter={presenter} />
                ) : (

                    <PostStatus />
                )
            }
        </MemoryRouter>
    )
}

const renderPostStatusAndGetElement = (presenter?: PostStatusPresenter) => {
    const userAction = userEvent.setup()

    renderPostStatus(presenter)

    const textArea = screen.getByRole('textbox')
    const clearButton = screen.getByLabelText('clear')
    const postButton = screen.getByLabelText('post')

    return {userAction, textArea, clearButton, postButton}
}