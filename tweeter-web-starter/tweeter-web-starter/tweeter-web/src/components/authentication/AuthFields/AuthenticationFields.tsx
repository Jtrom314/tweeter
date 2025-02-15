
interface Props {
    setAlias: (value: string) => void
    setPassword: (value: string) => void
    authenticationAction: (event: React.KeyboardEvent<HTMLElement>) => void
}

const AuthenticationFields = (props: Props) => {
    return (
        <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            aria-label="alias"
            placeholder="name@example.com"
            onKeyDown={props.authenticationAction}
            onChange={(event) => props.setAlias(event.target.value)}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="passwordInput"
            aria-label="password"
            placeholder="Password"
            onKeyDown={props.authenticationAction}
            onChange={(event) => props.setPassword(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
        </>
    )
}

export default AuthenticationFields