/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../src";

describe("Get All Users", () => {
  it("responds with json", () => {
    request(app)
      .get("/api/users")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.data.length).toBe(1);
      });
  });
});

describe("Get Single User with User ID", () => {
  it("responds with json", () => {
    request(app)
      .get("/api/users")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.data).toBeTruthy();
      });
  });

  it("responds with error", () => {
    request(app)
      .get("/api/users")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBeTruthy();
      });
  });
});
