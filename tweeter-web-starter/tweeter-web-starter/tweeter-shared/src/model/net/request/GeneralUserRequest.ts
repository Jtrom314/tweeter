import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface GeneralUserRequest extends TweeterRequest {
    readonly user: UserDto
}