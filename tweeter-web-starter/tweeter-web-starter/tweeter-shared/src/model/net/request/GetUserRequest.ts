import { TweeterRequestToken } from "./TweeterRequestToken";

export interface GetUserRequest extends TweeterRequestToken {
    readonly userAlias: string
}