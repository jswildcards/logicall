import { describe, it, expect } from "@jest/globals";
import { paging } from "../../src/utils/paging";

describe("Get All Users", () => {
  it("responds with json", async () => {
    const page = paging({ number: 2, size: 5 });
    expect(page).toHaveProperty("offset", 5);
    expect(page).toHaveProperty("limit", 5);
    expect(page).not.toHaveProperty("number");
    expect(page).not.toHaveProperty("size");
  });
});
