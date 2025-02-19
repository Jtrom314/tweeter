import { DAOImplementation } from "./DAOImplementation";
import { FeedDAO, FeedDTO } from "../interfaces/FeedDAO";
import { StatusDto } from "tweeter-shared";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { DataPage } from "../../DataPage";

export class FeedDAOImplementation extends DAOImplementation implements FeedDAO {
    async createFeedItem(ownerAlias: string, authorAlias: string, status: StatusDto): Promise<void> {
        return await this.doAWSOperation(async () => {
            const command = new PutCommand({
                TableName: this.feedTable,
                Item: {
                    [this.ownerField]: ownerAlias,
                    [this.authorField]: authorAlias,
                    [this.timestampField]: status.timestamp,
                    [this.postField]: status.post
                }
            })

            await this.client.send(command)
        }, "Create feed item")
    }

    async getPageOfFeedItems(ownerAlias: string, pageSize: number, lastTimeStamp: number | undefined): Promise<DataPage<FeedDTO>> {
        return await this.doAWSOperation(async () => {
            const command = new QueryCommand({
                TableName: this.feedTable,
                Limit: pageSize,
                KeyConditionExpression: "#ownerAlias = :ownerAlias",
                ScanIndexForward: false,
                ExpressionAttributeNames: {
                    "#ownerAlias": this.ownerField
                },
                ExpressionAttributeValues: {
                    ":ownerAlias": { S: ownerAlias }
                },
                ExclusiveStartKey: lastTimeStamp !== undefined ? {
                    [this.ownerField]: { S: ownerAlias },
                    [this.timestampField]: { N: lastTimeStamp.toString() }
                } : undefined
            })

            const response = await this.client.send(command)
            const hasMorePages = response.LastEvaluatedKey !== undefined

            const items: FeedDTO[] = []
            response!.Items?.forEach((item) => {
                items.push({
                    alias: item[this.authorField].S as string,
                    timestamp: Number(item[this.timestampField].N),
                    post: item[this.postField].S as string
                })
            })

            return new DataPage<FeedDTO>(items, hasMorePages)
        }, "Get page of feed items")
    }
}