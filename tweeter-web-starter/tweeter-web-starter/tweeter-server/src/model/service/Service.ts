import { DAOFactory } from "../DAO/factory/DAOFactory"
import { AuthTokenDAO } from "../DAO/interfaces/AuthTokenDAO"
import { FeedDAO } from "../DAO/interfaces/FeedDAO"
import { FollowDAO } from "../DAO/interfaces/FollowDAO"
import { S3BucketDAO } from "../DAO/interfaces/S3BucketDAO"
import { StoryDAO } from "../DAO/interfaces/StoryDAO"
import { UserDAO } from "../DAO/interfaces/UserDAO"

export class Service {
    userDAO: UserDAO
    authDAO: AuthTokenDAO
    storyDAO: StoryDAO
    feedDAO: FeedDAO
    s3DAO: S3BucketDAO
    followDAO: FollowDAO

    constructor(factory: DAOFactory) {
        this.userDAO = factory.createUserDAO()
        this.authDAO = factory.createAuthDAO()
        this.s3DAO = factory.createS3DAO()
        this.followDAO = factory.createFollowDAO()
        this.storyDAO = factory.createStoryDAO()
        this.feedDAO = factory.createFeedDAO()
    }

    public formatAlias(alias: string): string {
        let formattedAlias: string = alias

        const punctuationRegex: RegExp = /[.,\/#!$%\^&\*;:{}=\-_`~()]/g
        formattedAlias = formattedAlias.replace(punctuationRegex, "")

        if (formattedAlias[0] != "@") {
            formattedAlias = "@" + formattedAlias
        }

        return formattedAlias
    }

    private async validateToken (token: string): Promise<boolean> {
        return await this.authDAO.validateAuth(token)
    }

    public async validatedOperation<T> (authToken: string, operation: () => Promise<T> ): Promise<T> {
        if (await this.validateToken(authToken)) {
            return await operation()
        } else {
            throw new Error("[Bad Request] Invalid token")
        }
    }
}