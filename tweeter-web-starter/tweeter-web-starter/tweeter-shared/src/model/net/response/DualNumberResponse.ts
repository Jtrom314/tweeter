import { TweeterResponse } from "./TweeterResponse";

export interface DualNumberResponse extends TweeterResponse {
    readonly followerCount: number,
    readonly followeeCount: number
}