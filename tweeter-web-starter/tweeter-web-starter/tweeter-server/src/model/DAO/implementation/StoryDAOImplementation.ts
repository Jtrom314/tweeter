import { DAOImplementation, DataPage } from "./DAOImplementation";
import { StatusDto } from "tweeter-shared";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { StoryDAO, StoryDTO } from "../interfaces/StoryDAO";
import { QueryCommand } from "@aws-sdk/client-dynamodb";

export class StoryDAOImplementation extends DAOImplementation implements StoryDAO {
    async createStoryItem(status: StatusDto): Promise<void> {
        return await this.doAWSOperation(async () => {
            const command = new PutCommand({
                TableName: this.storyTable,
                Item: {
                    [this.authorField]: status.user.alias,
                    [this.timestampField]: status.timestamp,
                    [this.postField]: status.post
                }
            })

            await this.client.send(command)
        }, "Create story item")
    }

    async getPageOfStoryItems(alias: string, pageSize: number, lastTimeStamp: number | undefined): Promise<DataPage<StoryDTO>> {
        const command = new QueryCommand({
            TableName: this.storyTable,
            Limit: pageSize,
            KeyConditionExpression: "#alias = :alias",
            ExpressionAttributeNames: {
                "#alias": this.aliasField
            },
            ExpressionAttributeValues: {
                ":alias": { S: alias }
            },
            ExclusiveStartKey: lastTimeStamp !== undefined ? {
                [this.aliasField]: { S: alias },
                [this.timestampField]: { N: lastTimeStamp.toString() }
            } : undefined
        })

        const response = await this.client.send(command)
        const hasMorePages = response.LastEvaluatedKey !== undefined

        const items: StoryDTO[] = []
        response!.Items?.forEach((item) => {
            items.push({
                alias: item.alias.S ?? "",
                timestamp: Number(item.timestamp.N) ?? 0,
                post: item.post.S ?? ""
            })
        })

        return new DataPage<StoryDTO>(items, hasMorePages)
    }
}