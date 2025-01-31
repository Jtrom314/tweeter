import { GetUserRequest } from "./GetUserRequest";

export interface PagedUserItemRequest<T> extends GetUserRequest {
    readonly pageSize: number,
    readonly lastItem: T | null
}