import { AuthToken, User } from "tweeter-shared";
import { AuthTokenDAO } from "../interfaces/AuthTokenDAO";
import { DAOImplementation } from "./DAOImplementation";
import { DeleteCommand, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";


export class AuthTokenDAOImplementation extends DAOImplementation implements AuthTokenDAO {
    async createAuth(user: User): Promise<AuthToken> {
        return await this.doAWSOperation(async () => {
            const authToken: AuthToken = AuthToken.Generate()
            const command = new PutCommand({
                TableName: this.authTable,
                Item: {
                    [this.tokenField]: authToken.token,
                    [this.timestampField]: authToken.timestamp.toString(),
                    [this.aliasField]: user.alias
                }
            })
    
            await this.client.send(command)
            return authToken
        }, "Create token")
    }

    async deleteAuth(tokenToRemove: string): Promise<void> {
        return await this.doAWSOperation(async () => {
            const command = new DeleteCommand({
                TableName: this.authTable,
                Key: {
                    [this.tokenField]: tokenToRemove
                }
            })
            
            await this.client.send(command)
        }, "Delete token")
    }

    async getAliasByAuth(tokenToRead: string): Promise<string | null> {
        return await this.doAWSOperation(async () => {
            const command = new GetCommand({
                TableName: this.authTable,
                Key: {
                    [this.tokenField]: tokenToRead
                }
            })
    
            const response = await this.client.send(command)
    
            if (!response.Item) {
                return null
            }
            
            const item = response.Item
            
            return item.alias.S!
        }, "Get alias by auth")
    }
    readonly expirationDuration = 10 * 60
    
    async validateAuth(tokenToRead: string): Promise<boolean> {
        return await this.doAWSOperation(async () => {
            const command = new GetCommand({
                TableName: this.authTable,
                Key: {
                    [this.tokenField]: tokenToRead
                }
            })
            const response = await this.client.send(command)
            if (response.Item == null) {
                return false
            }

            const now: number = Math.floor(Date.now() / 1000)
            const storedTimeStamp = Number(response.Item.timestamp.N)
            if (now - storedTimeStamp > this.expirationDuration) {
                await this.deleteAuth(tokenToRead)
                return false
            } else {
                await this.resetAuthTimer(tokenToRead)
                return true
            }

        }, "Validate auth")
    }

    async resetAuthTimer(tokenToRead: string): Promise<void> {
        return await this.doAWSOperation(async () => {
            const futureTime: number = Math.floor(Date.now() / 1000) + this.expirationDuration
            const command = new UpdateCommand({
                TableName: this.authTable,
                Key: {
                    [this.tokenField]: tokenToRead
                },
                UpdateExpression: "SET #ts = :expirationDateTime",
                ExpressionAttributeNames: {
                    "#ts": this.timestampField
                },
                ExpressionAttributeValues: {
                    ":expirationDateTime" : futureTime.toString()
                }
            })
            await this.client.send(command)
        }, "Reset authTimer")

    }
}