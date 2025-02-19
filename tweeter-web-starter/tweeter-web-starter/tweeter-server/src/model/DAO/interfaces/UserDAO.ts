import { User } from "tweeter-shared"

export interface UserDAO {
    createUser(firstName: string, lastName: string, alias: string, password: string, imageFileExtension: string): Promise<User>
    getUserByAlias(alias: string): Promise<User | null>
    getUserByAliasPassword(alias: string, hashedPassword: string): Promise<User | null>
    getFolloweeCount(alias: string): Promise<number> 
    getFollowerCount(alias: string): Promise<number> 
    updateFollowerCount(alias: string, newCount: number): Promise<void> 
    updateFolloweeCount(alias: string, newCount: number): Promise<void> 
}