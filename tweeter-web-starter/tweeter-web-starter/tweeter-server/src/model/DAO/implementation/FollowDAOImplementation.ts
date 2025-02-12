import { User } from "tweeter-shared";
import { FollowDAO } from "../interfaces/FollowDAO";
import { DAOImplementation, DataPage } from "./DAOImplementation";
import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { QueryCommand } from "@aws-sdk/client-dynamodb";

export class FollowDAOImplementation extends DAOImplementation implements FollowDAO {
    async getIsFollower(user: User, selectedUser: User): Promise<boolean> {
        return await this.doAWSOperation(async () => {
            const command = new GetCommand({
                TableName: this.followTable,
                Key: {
                    [this.followerHandleField]: user.alias,
                    [this.followeeHandleField]: selectedUser.alias
                }
            })
    
            const response = await this.client.send(command)
    
            return !!response.Item
        }, "Get is follower")
    }

    async followUser(baseUser: User, userToFollow: User): Promise<void> {
        return await this.doAWSOperation(async () => {
            const command = new PutCommand({
                TableName: this.followTable,
                Item: {
                    [this.followerHandleField]: baseUser.alias,
                    [this.followeeHandleField]: userToFollow.alias
                }
            })
    
            await this.client.send(command)
        }, "Follow user")
    }
    
    async unfollowUser(baseUser: User, userToUnfollow: User): Promise<void> {
        return await this.doAWSOperation(async () => {
            const command = new DeleteCommand({
                TableName: this.followTable,
                Key: {
                    [this.followerHandleField]: baseUser,
                    [this.followeeHandleField]: userToUnfollow
                }
            })
    
            await this.client.send(command)
        }, "Unfollow user")
    }

    async getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHanldle: string | undefined): Promise<DataPage<string>> {
        const command = new QueryCommand({
            TableName: this.followTable,
            Limit: pageSize,
            IndexName: '',
            KeyConditionExpression: `#${this.followeeHandleField} = :followeeVal`,
            ExpressionAttributeNames: {
                "#followeeHandle": this.followeeHandleField
            },
            ExpressionAttributeValues: {
                ":followeeVal": { S: followeeHandle }
            },
            ExclusiveStartKey: lastFollowerHanldle ? {
                [this.followerHandleField]: { S: lastFollowerHanldle },
                [this.followeeHandleField]: { S: followeeHandle }
            } : undefined
        })

        const response = await this.client.send(command)
        const hasMorePages = response.LastEvaluatedKey !== undefined

        const items: string[] = []
        response!.Items!.forEach((item) => {
            items.push(item[this.followerHandleField].S ?? "")
        })

        return new DataPage<string>(items, hasMorePages)
    }

    async getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<DataPage<string>> {
        const command = new QueryCommand({
            TableName: this.followTable,
            Limit: pageSize,
            KeyConditionExpression: `${this.followerHandleField} = :followerVal`,
            ExpressionAttributeNames: {
                "#followerHandle": this.followerHandleField
            },
            ExpressionAttributeValues: {
                ":followerVal": { S: followerHandle }
            },
            ExclusiveStartKey: lastFolloweeHandle ? {
                [this.followerHandleField]: { S: followerHandle },
                [this.followeeHandleField]: { S: lastFolloweeHandle }
            } : undefined
        })

        const response = await this.client.send(command)
        const hasMorePages = response.LastEvaluatedKey !== undefined

        const items: string[] = []
        response!.Items!.forEach((item) => {
            items.push(item[this.followeeHandleField].S ?? "")
        })

        return new DataPage<string>(items, hasMorePages)
    }
}