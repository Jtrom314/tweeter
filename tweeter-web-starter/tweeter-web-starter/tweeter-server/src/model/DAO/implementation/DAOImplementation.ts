import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

export class DataPage<T> {
    values: T[]
    hasMorePages: boolean

    constructor(values: T[], hasMorePages: boolean) {
        this.values = values
        this.hasMorePages = hasMorePages
    }
}

export class DAOImplementation {
    readonly client = DynamoDBDocumentClient.from(new DynamoDBClient())

    readonly userTable = "User"
    readonly feedTable = "Feed"
    readonly storyTable = "Story"
    readonly authTable = "Auth"
    readonly followTable = "Follow"

    readonly authorField = "author"
    readonly timestampField = "timestamp"
    readonly tokenField = "token"
    readonly postField = "post"

    readonly followerHandleField = "followerHandle"
    readonly followeeHandleField = "followeeHandle"

    readonly aliasField = "alias"
    readonly firstNameField = "firstName"
    readonly lastNameField = "lastName"
    readonly hashedPasswordField = "hashedPassword"
    readonly profilePictureField = "profiePicture"
    readonly numFollowersField = "numFollowers"
    readonly numFolloweesField = "numFollowees"

    async doAWSOperation<T> (operation: () => Promise<T>, operationDescription: string): Promise<T> {
        try {
            return await operation()
        } catch (error) {
            throw new Error(`${operationDescription} failed with: ${error}`)
        }
    }
}