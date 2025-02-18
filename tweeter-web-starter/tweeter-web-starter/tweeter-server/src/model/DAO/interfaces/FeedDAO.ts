import { StatusDto } from "tweeter-shared";
import { DataPage } from "../../DataPage";

export interface FeedDTO {
    readonly alias: string,
    readonly timestamp: number,
    readonly post: string
}

export interface FeedDAO  {
    createFeedItem(ownerAlias: string, authorAlias: string, status: StatusDto): Promise<void>
    getPageOfFeedItems(ownerAlias: string, pageSize: number, lastTimeStamp: number | undefined): Promise<DataPage<FeedDTO>>
}