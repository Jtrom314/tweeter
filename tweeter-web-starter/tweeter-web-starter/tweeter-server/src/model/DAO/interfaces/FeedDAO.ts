import { StatusDto } from "tweeter-shared";

export interface FeedDAO  {
    createFeedItem(alias: string, status: StatusDto): Promise<void>
}