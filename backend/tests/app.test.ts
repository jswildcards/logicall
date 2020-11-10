import request from "supertest";
import mysql from "mysql2/node_modules/iconv-lite";
import { describe, expect, it } from "@jest/globals";
import app from "../src/app";

mysql.encodingExists("foo");

describe("Get All Users", () => {
  it("responds with json", async () => {
    await request(app)
      .get("/api/users")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.data.length).toBeLessThanOrEqual(20);
      });
  });

  it("responds with json restricted", async () => {
    await request(app)
      .get("/api/users?page[size]=10&page[number]=2")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.data.length).toBeLessThanOrEqual(10);
        if (response.body.data.length) {
          expect(response.body.data[0].id).toBe(11);
        }
      });
  });

  it("responds with json restricted", async () => {
    await request(app)
      .get("/api/users?page[size]=50")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.data.length).toBeLessThanOrEqual(50);
      });
  });
});

describe("Get Single User with User ID", () => {
  it("responds with json", async () => {
    await request(app)
      .get("/api/users/1")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.data).toBeTruthy();
      });
  });

  it("responds with error", async () => {
    await request(app)
      .get("/api/users/50000000")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404)
      .then((response) => {
        expect(response.body.data).toBeFalsy();
        expect(response.body.error).toBeTruthy();
      });
  });
});

describe("Sign In", () => {
  it("responds with json", async () => {
    const user = { username: "admin1", password: "password" };

    await request(app)
      .post("/api/users/sign-in")
      .send(user)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.data).toBeTruthy();
      });
  });

  // it("responds with error", async () => {
  //   await request(app)
  //     .get("/api/users/50000000")
  //     .set("Accept", "application/json")
  //     .expect("Content-Type", /json/)
  //     .expect(404)
  //     .then((response) => {
  //       expect(response.body.data).toBeFalsy();
  //       expect(response.body.error).toBeTruthy();
  //     });
  // });
});

// describe("Create User", async () => {
//   it("response with json", async () => {
//     const users = new Array(20).fill(0).map((_, i) => ({
//       firstName: "tin lok",
//       lastName: "law",
//       email: `tinloklaw${i}@example.com`,
//       username: `tinloklaw${i}`,
//       password: "password",
//       phone: "21345678",
//       role: "customer",
//     }));

//     await Promise.all(
//       users.map((user) =>
//         request(app)
//           .post("/api/users")
//           .send(user)
//           .set("Accept", "application/json")
//           .expect("Content-Type", /json/)
//           .expect(201)
//           .then((response) => {
//             expect(response.body.data).toBeTruthy();
//             expect(response.body.error).toBeFalsy();
//           })
//       ),
//     );
//   });
// });

// describe("Create User", () => {
//   it("response with json", async () => {
//     const id =
//       Math.random().toString(36).split(".")[1] +
//       new Date().valueOf().toString(36);
//     const user = {
//       firstName: "tin lok",
//       lastName: "law",
//       email: `${id}@example.com`,
//       username: id,
//       password: "password",
//       phone: "21345678",
//       role: "customer",
//     };

//     await request(app)
//       .post("/api/users")
//       .send(user)
//       .set("Accept", "application/json")
//       .expect("Content-Type", /json/)
//       .expect(201)
//       .then((response) => {
//         expect(response.body.data).toBeTruthy();
//         expect(response.body.error).toBeFalsy();
//       });
//   });
// });

// describe("Delete User", () => {
//   it("have deletedAt attributes", async () => {
//     await request(app)
//       .delete("/api/users/23")
//       .set("Accept", "application/json")
//       .expect("Content-Type", /json/)
//       .expect(200)
//       .then((response) => {
//         expect(response.body.status).toBe("success");
//       });
//   });
// });
