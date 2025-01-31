import { TweeterResponse } from "./TweeterResponse";

export interface BoolResponse extends TweeterResponse {
    readonly booleanValue: boolean
}