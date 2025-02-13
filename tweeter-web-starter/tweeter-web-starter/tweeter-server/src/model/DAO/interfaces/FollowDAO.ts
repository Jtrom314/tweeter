import { User } from "tweeter-shared"
import { DataPage } from "../../DataPage"

export interface FollowDAO {
    getIsFollower(user: User, selectedUser: User): Promise<boolean>
    getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHanldle: string | undefined): Promise<DataPage<string>>
    getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<DataPage<string>>
    followUser(baseUser: User, userToFollow: User): Promise<void>
    unfollowUser(baseUser: User, userToUnfollow: User): Promise<void>
}