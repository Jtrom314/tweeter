import { TweeterRequest } from "./TweeterRequest";

export interface TweeterRequestToken extends TweeterRequest {
    readonly token: string,
}