import { AuthToken, User } from "tweeter-shared";

export interface AuthTokenDAO {
    createAuth(user: User): Promise<AuthToken>
    deleteAuth(tokenToRemove: string): Promise<void>
    getAliasByAuth(tokenToRead: string): Promise<string | null>
    validateAuth(tokenToRead: string): Promise<boolean>
}