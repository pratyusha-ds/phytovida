import { describe, test, expect, vi, beforeEach } from "vitest";
import { getPlants } from "./plantlibrary.js";

// mocks the db 
vi.mock("../db/index.js", () => ({
    db: {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn()
            .mockResolvedValueOnce([{ count: 0 }])
            .mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([]),
    },
}));

// mocks the req and res
const mockRequest = (query = {}) => ({ query } as any);
const mockResponse = () => {
    const res = {} as any;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
};

// tests getPlants
describe("getPlants", () => {
    beforeEach(() => vi.clearAllMocks());

    test("returns paginated plants", async () => {
        const req = mockRequest({ page: "1", limit: "10" });
        const res = mockResponse();

        await getPlants(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            data: [],
            pagination: { total: 0, hasNextPage: false }
        });
    });

    test("returns 500 error", async () => {
        const { db } = await import("../db/index.js");

        (db.select as any).mockImplementationOnce(() => {
            throw new Error("DB connection failed")
        })

        const req = mockRequest({ page: "1", limit: "10" });
        const res = mockResponse();

        await getPlants(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch plants from Perenual" })


    })
});


// describe("getPlantsData", () => {
//     test("calls the Perenual API", async () => {

//     })
//     test("uploads image to Cloudinary", async () => {

//     })

//     test("populates Plants table in db", async () => {

//     })
// })