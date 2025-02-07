import { GeneralUserRequest, PagedUserItemRequest, RegisterRequest, UserDto } from "tweeter-shared"
import { ServerFacade } from "../../../src/network/ServerFacade"
import "isomorphic-fetch" 

describe("ServerFacade Tests", () => {
    const serverFacade = new ServerFacade()

    const createRandomName = () => {
        return (Math.random() + 1).toString().substring(2, 5)
    }

    // Register
    test("Register returns a user and an authToken upon a successful call to the server", async () => {
        const request: RegisterRequest = {
            firstName: createRandomName(),
            lastName: createRandomName(),
            userImageBytes: createRandomName(),
            alias: createRandomName(),
            password: createRandomName(),
            imageFileExtension: createRandomName()  
        }

        const [user, authToken] = await serverFacade.register(request)

        expect(user).not.toBeNull()
        expect(authToken).not.toBeNull()
    })  

    // GetFollowers
    test("Get Followers gets a list of followers from the server", async () => {
        const request: PagedUserItemRequest<UserDto> = {
            pageSize: 10,
            lastItem: {
                firstName: createRandomName(),
                lastName: createRandomName(),
                alias: createRandomName(),
                imageUrl: createRandomName(),
            },
            userAlias: createRandomName(),
            token: createRandomName()
        }

        const [users, hasMore] = await serverFacade.getMoreFollowers(request)

        expect(typeof hasMore).toBe('boolean')
        expect(users.length).toBeGreaterThan(1)
    })

    // GetFollowersCount
    test("Get Followers Count returns a valid number", async () => {
        const request: GeneralUserRequest = {
            token: createRandomName(),
            user: {
                firstName: createRandomName(),
                lastName: createRandomName(),
                alias: createRandomName(),
                imageUrl: createRandomName(),
            }
        }

        const followerNumber = await serverFacade.getFollowerCount(request)

        expect(followerNumber).toBeGreaterThanOrEqual(0)
    })
})