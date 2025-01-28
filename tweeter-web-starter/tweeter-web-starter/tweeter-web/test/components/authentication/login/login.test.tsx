import Login from '../../../../src/components/authentication/login/Login'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/react"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { instance, mock, verify } from 'ts-mockito'


library.add(fab)

import "@testing-library/jest-dom"
import { UserLoginPresenter } from '../../../../src/presenter/UserLoginPresenter'

describe("Login component", () => {
    it('should have sign in button disabled on initial render', () => {
        const {signInButton} = renderLoginAndGetElement("/")
        expect(signInButton).toBeDisabled()
    })

    it('enables the sign-in button if both alias and password fields have text', async () => {
        const { signInButton, user, alias, password } = renderLoginAndGetElement("/")

        await user.type(alias, 'a')
        await user.type(password, 'b')

        expect(signInButton).toBeEnabled()
    })

    it('disables the signin button if either filed is cleared', async () => {
        const { signInButton, user, alias, password } = renderLoginAndGetElement("/")

        await user.type(alias, 'a')
        await user.type(password, 'b')

        expect(signInButton).toBeEnabled()

        await user.clear(alias)
        expect(signInButton).toBeDisabled()

        await user.type(alias, 'a')
        expect(signInButton).toBeEnabled()

        await user.clear(password)
        expect(signInButton).toBeDisabled()
    })

    it("calls the presenters login method with correct parameters when the sign-n button is pressed", async () => {
        const mockPresenter = mock<UserLoginPresenter>()
        const mockPresenterInstacne = instance(mockPresenter);
        const originalURL = 'http://test.com'
        const aliasText = 'a'
        const passwordText = 'p'
        const { signInButton, user, alias, password } = renderLoginAndGetElement(originalURL, mockPresenterInstacne)

        await user.type(alias, aliasText)
        await user.type(password, passwordText)

        await user.click(signInButton)

        verify(mockPresenter.doLogin(aliasText, passwordText, false, originalURL)).once()
    })
})

const renderLogin = (originalURL: string, presenter?: UserLoginPresenter) => {
    return render(
        <MemoryRouter>
            {
                !!presenter ? 
                (
                    <Login originalUrl={originalURL} presenter={presenter}/>
                ) : (
                    <Login originalUrl={originalURL} />
                )

            }
        </MemoryRouter>
    );
}

const renderLoginAndGetElement = (originalURL: string, presenter?: UserLoginPresenter) => {
    const user = userEvent.setup()

    renderLogin(originalURL, presenter)

    const signInButton = screen.getByRole("button", { name: /Sign in/i })
    const alias = screen.getByLabelText("alias")
    const password = screen.getByLabelText('password')

    return {signInButton, alias, password, user}
}