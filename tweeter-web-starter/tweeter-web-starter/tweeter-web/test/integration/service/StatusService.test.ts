import "isomorphic-fetch" 
import { StatusService } from "../../../src/model/service/statusService"
import { AuthToken, Status, User } from "tweeter-shared"

describe("StatusService Tests", () => {
    const statusService = new StatusService()

    /**
     * Using the Jest testing framework, write an INTEGRATION test for your client-side Service that returns a user's story pages (i.e., StatusService). 
     * Service methods are async so your tests will need to await the results of calling service methods before testing expectations. 
     * Your test should test the results of a successful story retrieval.
     */

    it("should return a user's status story pages", async () => {
        const authToken: AuthToken = new AuthToken("test", 1)
        const user: User = new User("test", "test", "test", "test")
        const status: Status = new Status("test", user, 1)

        const [statusArray, hasMore] = await statusService.loadMoreStoryItems(authToken, "@Test", 10, status)

        expect(statusArray.length).toBeGreaterThanOrEqual(0)
        expect(typeof hasMore).toBe('boolean')
    })
})