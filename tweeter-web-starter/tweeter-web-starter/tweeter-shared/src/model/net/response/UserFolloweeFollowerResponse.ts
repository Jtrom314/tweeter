import { TweeterResponse } from "./TweeterResponse";

export interface UserFolloweeFollowerResponse extends TweeterResponse {
    readonly followNumber: number
}