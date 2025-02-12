import { StatusDto } from "tweeter-shared";
import { DataPage } from "../implementation/DAOImplementation";

export interface StoryDTO {
    readonly alias: string,
    readonly timestamp: number,
    readonly post: string
}

export interface StoryDAO {
    createStoryItem(status: StatusDto): Promise<void>
    getPageOfStoryItems(alias: string, pageSize: number, lastTimeStamp: number | undefined): Promise<DataPage<StoryDTO>>
}