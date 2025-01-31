import { StatusDto } from "../../dto/StatusDto";
import { TweeterRequestToken } from "./TweeterRequestToken";

export interface PostStatusItemRequest extends TweeterRequestToken {
    readonly status: StatusDto
}