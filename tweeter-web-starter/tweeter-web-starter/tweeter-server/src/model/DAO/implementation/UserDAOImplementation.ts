import { User } from "tweeter-shared";
import { UserDAO } from "../interfaces/UserDAO";
import { DAOImplementation } from "./DAOImplementation";
import * as bcrypt from "bcryptjs"
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export class UserDAOImplementation extends DAOImplementation implements UserDAO {
    async createUser(firstName: string, lastName: string, alias: string, password: string, imageFileExtension: string): Promise<User> {
        return await this.doAWSOperation(async () => {
            const command = new PutCommand({
                TableName: this.userTable,
                Item: {
                    [this.firstNameField]: firstName,
                    [this.lastNameField]: lastName,
                    [this.aliasField]: alias,
                    [this.hashedPasswordField]: password,
                    [this.profilePictureField]: imageFileExtension,
                    [this.numFollowersField]: 0,
                    [this.numFolloweesField]: 0
                }
            })
    
            await this.client.send(command)
            return new User(firstName, lastName, alias, imageFileExtension)
        }, "Create user")
    }

    async getUserByAlias(alias: string): Promise<User | null> {
        return await this.doAWSOperation(async () => {
            const command = new GetCommand({
                TableName: this.userTable,
                Key: {
                    [this.aliasField]: alias
                }
            })
    
            const response = await this.client.send(command)
    
            if (!response.Item) {
                return null
            }
            
            const item = response.Item
    
            return new User(item[this.firstNameField], item[this.lastNameField], item[this.aliasField], item[this.profilePictureField])
        }, "Get user by alias")
    }

    async getUserByAliasPassword(alias: string, password: string): Promise<User | null> {
        return await this.doAWSOperation(async () => {
            const command = new GetCommand({
                TableName: this.userTable,
                Key: {
                    [this.aliasField]: alias
                }
            })
    
            const response = await this.client.send(command)
    
            if (!response.Item) {
                console.error(`No user found with alias: ${alias}`)
                return null
            }

            console.table(response.Item)

            if (!response.Item[this.hashedPasswordField]) {
                throw new Error("Stored password field is missing in the database.")
            }

            const passwordToCompare: string = response.Item[this.hashedPasswordField]

            const isSame: boolean = await bcrypt.compare(password, passwordToCompare)

            if (!isSame) {
                return null
            }
            
            const item = response.Item
    
            return new User(item[this.firstNameField], item[this.lastNameField], item[this.aliasField], item[this.profilePictureField])
        }, "Get user")
    }

    async updateFolloweeCount(alias: string, newCount: number): Promise<void> {
        return await this.doAWSOperation(async () => {
            const command = new UpdateCommand({
                TableName: this.userTable,
                Key: {
                    [this.aliasField]: alias
                },
                UpdateExpression: "SET #followee = #followee + :numDiff",
                ExpressionAttributeNames: {
                    "#followee" : this.numFolloweesField
                },
                ExpressionAttributeValues: {
                    ":numDiff": newCount
                }
            })
    
            await this.client.send(command)
        }, "Update followee count")
    }

    async updateFollowerCount(alias: string, newCount: number): Promise<void> {
        return await this.doAWSOperation(async () => {
            const command = new UpdateCommand({
                TableName: this.userTable,
                Key: {
                    [this.aliasField]: alias
                },
                UpdateExpression: "SET #follower = #follower + :numDiff",
                ExpressionAttributeNames: {
                    "#follower": this.numFollowersField
                },
                ExpressionAttributeValues: {
                    ":numDiff": newCount
                }
            })
    
            await this.client.send(command)
        }, "Update follower count")
    }

    async getFolloweeCount(alias: string): Promise<number> {
        return await this.doAWSOperation(async () => {
            const command = new GetCommand({
                TableName: this.userTable,
                Key: {
                    [this.aliasField]: alias
                },
                ProjectionExpression: this.numFolloweesField
            })
    
            const response = await this.client.send(command)
    
            return Number(response.Item![this.numFolloweesField])
        }, "Get followee count")
    }

    async getFollowerCount(alias: string): Promise<number> {
        return await this.doAWSOperation(async () => {
            const command = new GetCommand({
                TableName: this.userTable,
                Key: {
                    [this.aliasField]: alias
                },
                ProjectionExpression: this.numFollowersField
            })
    
            const response = await this.client.send(command)
    
            return Number(response.Item![this.numFollowersField])
        }, "Get follower count")
    }
}