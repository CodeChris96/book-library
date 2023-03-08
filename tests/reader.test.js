const { expect } = require("chai");
const request = require("supertest");
const { Reader } = require("../src/models");
const app = require("../src/app");

describe("/readers", () => {
  before(async () => Reader.sequelize.sync());

  beforeEach(async () => {
    await Reader.destroy({ where: {} });
  });
  describe("with no records in the database", () => {
    describe("POST /readers", () => {
      it("creates a new reader in the database", async () => {
        const response = await request(app).post("/readers").send({
          name: "Harry Potter",
          email: "harrypotter@hogwarts.edu",
          password: "avada kedavra",
        });
        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal("Harry Potter");
        expect(newReaderRecord.name).to.equal("Harry Potter");
        expect(newReaderRecord.email).to.equal("harrypotter@hogwarts.edu");
        expect(newReaderRecord.password).to.equal("avada kedavra");
      });

      it("returns an error message if name is not provided", async () => {
        const response = await request(app).post("/readers").send({
          email: "harrypotter@hogwarts.edu",
          password: "avada kedavra",
        });

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal("Name is required.");
      });

      it("returns an error message if email is not provided", async () => {
        const response = await request(app).post("/readers").send({
          name: "Harry Potter",
          password: "avada kedavra",
        });

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal("Email is required.");
      });

      it("returns an error message if email is not correctly formatted", async () => {
        const response = await request(app).post("/readers").send({
          name: "Harry Potter",
          email: "harrypotter",
          password: "avada kedavra",
        });

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal(
          "Email is not formatted correctly."
        );
      });

      it("returns an error message if password is not provided", async () => {
        const response = await request(app).post("/readers").send({
          name: "Harry Potter",
          email: "harrypotter@hogwarts.edu",
        });

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal("Password is required.");
      });

      it("returns an error message if password is too short", async () => {
        const response = await request(app).post("/readers").send({
          name: "Harry Potter",
          email: "harrypotter@hogwarts.edu",
          password: "1234567",
        });

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal(
          "Password must be at least 8 characters long."
        );
      });
    });
  });

  describe("with records in the database", () => {
    let readers;

    beforeEach(async () => {
      readers = await Promise.all([
        Reader.create({
          name: "Hermione Granger",
          email: "hermione.granger@hogwarts.edu",
          password: "accio book",
        }),
        Reader.create({
          name: "Ron Weasley",
          email: "ron.weasley@hogwarts.edu",
          password: "wingardium leviosa",
        }),
        Reader.create({
          name: "Ginny Weasley",
          email: "ginny.weasley@hogwarts.edu",
          password: "expecto patronum",
        }),
      ]);
    });

    describe("GET /readers", () => {
      it("gets all readers records", async () => {
        const response = await request(app).get("/readers");

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((reader) => {
          const expected = readers.find((a) => a.id === reader.id);

          expect(reader.name).to.equal(expected.name);
          expect(reader.email).to.equal(expected.email);
          expect(reader.password).to.equal(expected.password);
        });
      });
    });

    describe("GET /readers/:id", () => {
      it("gets readers record by id", async () => {
        const reader = readers[0];
        const response = await request(app).get(`/readers/${reader.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(reader.name);
        expect(response.body.email).to.equal(reader.email);
        // expect(response.body.password).to.equal(reader.password);
      });

      it("returns a 404 if the reader does not exist", async () => {
        const response = await request(app).get("/readers/12345");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The reader could not be found.");
      });
    });

    describe("PATCH /readers/:id", () => {
      it("updates readers email by id", async () => {
        const reader = readers[0];
        const response = await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ email: "harrypotter@gmail.com" });
        const updatedReaderRecord = await Reader.findByPk(reader.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedReaderRecord.email).to.equal("harrypotter@gmail.com");
      });

      it("returns a 404 if the reader does not exist", async () => {
        const response = await request(app)
          .patch("/readers/12345")
          .send({ email: "some_new_email@gmail.com" });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The reader could not be found.");
      });
    });

    describe("DELETE /readers/:id", () => {
      it("deletes reader record by id", async () => {
        const reader = readers[0];
        const response = await request(app).delete(`/readers/${reader.id}`);
        const deletedReader = await Reader.findByPk(reader.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedReader).to.equal(null);
      });

      it("returns a 404 if the reader does not exist", async () => {
        const response = await request(app).delete("/readers/12345");
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The reader could not be found.");
      });
    });
  });
});
