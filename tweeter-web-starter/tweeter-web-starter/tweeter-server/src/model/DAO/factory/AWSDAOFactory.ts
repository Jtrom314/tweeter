import { AuthTokenDAOImplementation } from "../implementation/AuthTokenDAOImplementation";
import { FeedDAOImplementation } from "../implementation/FeedDAOImplementation";
import { FollowDAOImplementation } from "../implementation/FollowDAOImplementation";
import { S3BucketDAOImplementation } from "../implementation/S3BucketDAOImplementation";
import { StoryDAOImplementation } from "../implementation/StoryDAOImplementation";
import { UserDAOImplementation } from "../implementation/UserDAOImplementation";
import { AuthTokenDAO } from "../interfaces/AuthTokenDAO";
import { FeedDAO } from "../interfaces/FeedDAO";
import { FollowDAO } from "../interfaces/FollowDAO";
import { S3BucketDAO } from "../interfaces/S3BucketDAO";
import { StoryDAO } from "../interfaces/StoryDAO";
import { UserDAO } from "../interfaces/UserDAO";
import { DAOFactory } from "./DAOFactory";

export class AWSDAOFactory implements DAOFactory {
    private static instance: AWSDAOFactory

    private constructor() {

    }

    public static getInstance(): AWSDAOFactory {
        if (!AWSDAOFactory.instance) {
            AWSDAOFactory.instance = new AWSDAOFactory()
        }
        return AWSDAOFactory.instance
    }

    createUserDAO(): UserDAO {
        return new UserDAOImplementation()
    }

    createAuthDAO(): AuthTokenDAO {
        return new AuthTokenDAOImplementation()
    }

    createS3DAO(): S3BucketDAO {
        return new S3BucketDAOImplementation()
    }

    createFollowDAO(): FollowDAO {
        return new FollowDAOImplementation()
    }

    createStoryDAO(): StoryDAO {
        return new StoryDAOImplementation()
    }

    createFeedDAO(): FeedDAO {
        return new FeedDAOImplementation()
    }
}