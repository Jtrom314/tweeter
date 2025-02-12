import { AuthTokenDAO } from "../interfaces/AuthTokenDAO";
import { FollowDAO } from "../interfaces/FollowDAO";
import { S3BucketDAO } from "../interfaces/S3BucketDAO";
import { StoryDAO } from "../interfaces/StoryDAO";
import { UserDAO } from "../interfaces/UserDAO";

export interface DAOFactory {
    createUserDAO(): UserDAO
    createAuthDAO(): AuthTokenDAO
    createS3DAO(): S3BucketDAO
    createFollowDAO(): FollowDAO
    createStoryDAO(): StoryDAO
}