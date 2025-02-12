import { DAOImplementation } from "./DAOImplementation";
import { FeedDAO } from "../interfaces/FeedDAO";
import { StatusDto } from "tweeter-shared";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export class FeedDAOImplementation extends DAOImplementation implements FeedDAO {
    async createFeedItem(alias: string, status: StatusDto): Promise<void> {
        return await this.doAWSOperation(async () => {
            const command = new PutCommand({
                TableName: this.feedTable,
                Item: {
                    [this.authorField]: alias,
                    [this.timestampField]: status.timestamp,
                    [this.postField]: status.post
                }
            })

            await this.client.send(command)
        }, "Create feed item")
    }
}