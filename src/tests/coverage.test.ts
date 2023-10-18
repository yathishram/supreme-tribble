import { Server } from "../server";
const request = require("supertest");

describe("Total Coverage Tests", () => {
  let serverInstance: Server;
  let app: any;
  let token: string;

  const favorites = [
    "https://www.wired.com/story/have-a-nice-future-podcast-24/",
  ];
  const read = ["https://www.wired.com/story/have-a-nice-future-podcast-24/"];

  const preferences = [
    "Technology",
    "Science",
    "Business",
    "Entertainment",
    "Sports",
    "Health",
  ];

  const user = {
    username: "yathishramamurthy",
    password: "12345678",
    email: "123yathish@gmail.com",
    firstName: "yathish",
    lastName: "ramamurthy",
  };

  beforeAll((done) => {
    serverInstance = new Server();
    app = serverInstance.app;
    serverInstance.startServer(); // Start the server
    done();
  });

  afterAll(async () => {
    await serverInstance.stopServer();
  });

  describe("Auth Endpoints", () => {
    describe("POST /api/v1/auth/register", () => {
      it("should register a new user", async () => {
        const response = await request(app)
          .post("/api/v1/auth/register")
          .send({ user });

        expect(response.status).toBe(201);
        expect(response.body.data.user.username).toBe(user.username);
        // Add other assertions based on response structure
      });

      it("should not register a duplicate user", async () => {
        const response = await request(app)
          .post("/api/v1/auth/register")
          .send({ user });

        expect(response.status).toBe(409);
      });
    });

    describe("POST /api/v1/auth/login", () => {
      it("should log in a registered user", async () => {
        const response = await request(app).post("/api/v1/auth/login").send({
          username: user.username,
          password: user.password,
        });

        token = response.body.data.token;
        expect(response.status).toBe(200);
        expect(response.body.data.token).toBeDefined();
      });

      it("should not log in with wrong password", async () => {
        const response = await request(app).post("/api/v1/auth/login").send({
          username: user.username,
          password: "wrongPassword",
        });

        expect(response.status).toBe(401);
      });
    });
  });

  describe("News Endpoints", () => {
    describe("GET /api/v1/news", () => {
      it("should fetch news", async () => {
        const response = await request(app)
          .get("/api/v1/news")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        // Add other assertions based on response structure
      });
    });

    describe("PUT /api/v1/news/preferences", () => {
      it("should update preferences", async () => {
        const response = await request(app)
          .put("/api/v1/news/preferences")
          .set("Authorization", `Bearer ${token}`)
          .send({
            preferences,
          });

        expect(response.status).toBe(200);
        // Assertions...
      });
    });

    describe("GET /api/v1/news/preferences", () => {
      it("should fetch preferences", async () => {
        const response = await request(app)
          .get("/api/v1/news/preferences")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data.preferences).toEqual(preferences);
      });
    });

    describe("POST /api/v1/news/favorites", () => {
      it("should add news to favorites", async () => {
        const response = await request(app)
          .post("/api/v1/news/favorites")
          .set("Authorization", `Bearer ${token}`)
          .send({
            favorites,
          });

        expect(response.status).toBe(200);
        // Assertions...
      });
    });

    describe("GET /api/v1/news/favorites", () => {
      it("should fetch favorites", async () => {
        const response = await request(app)
          .get("/api/v1/news/favorites")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data.favorites).toEqual(favorites);
      });
    });

    describe("POST /api/v1/news/read", () => {
      it("should add news to read", async () => {
        const response = await request(app)
          .post("/api/v1/news/read")
          .set("Authorization", `Bearer ${token}`)
          .send({
            read,
          });

        expect(response.status).toBe(200);
        // Assertions...
      });
    });

    describe("GET /api/v1/news/read", () => {
      it("should fetch read", async () => {
        const response = await request(app)
          .get("/api/v1/news/read")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data.read).toEqual(read);
      });
    });

    describe("GET /api/v1/news/:search", () => {
      it("should search news", async () => {
        const response = await request(app)
          .get("/api/v1/news/technology")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
      });
    });
  });
});
