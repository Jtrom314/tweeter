import { User } from "tweeter-shared"
import { DataPage } from "../../DataPage"

export interface FollowDAO {
    getIsFollower(user: User, selectedUser: User): Promise<boolean>
    getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHanldle: string | undefined): Promise<DataPage<string>>
    getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<DataPage<string>>
    followUser(baseUserAlias: string, userToFollowAlias: string): Promise<void>
    unfollowUser(baseUserAlias: string, userToFollowAlias: string): Promise<void>
}