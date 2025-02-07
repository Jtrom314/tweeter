import { UserDto } from "../../dto/UserDto";
import { TweeterRequestToken } from "./TweeterRequestToken";

export interface GeneralUserRequest extends TweeterRequestToken {
    readonly user: UserDto
    readonly addtionalUser?: UserDto
}