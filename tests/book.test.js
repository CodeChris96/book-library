const { expect } = require("chai");
const request = require("supertest");
const { Book } = require("../src/models");
const app = require("../src/app");

describe("/books", () => {
  before(async () => Book.sequelize.sync());

  beforeEach(async () => {
    await Book.destroy({ where: {} });
  });

  afterEach(async () => {
    await Book.destroy({ where: {} });
  });

  describe("with no records in the database", () => {
    describe("POST /books", () => {
      it("creates a new book in the database", async () => {
        const response = await request(app).post("/books").send({
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          genre: "Classic Literature",
          ISBN: "978-0-684-80146-2",
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal("The Great Gatsby");
        expect(newBookRecord.author).to.equal("F. Scott Fitzgerald");
        expect(newBookRecord.genre).to.equal("Classic Literature");
        expect(newBookRecord.ISBN).to.equal("978-0-684-80146-2");
      });

      it("returns an error if the title is not provided", async () => {
        const response = await request(app).post("/books").send({
          author: "Jane Austen",
          genre: "Romance",
          ISBN: "978-1-4905-9185-7",
        });
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal("Title is required.");
      });

      it("returns an error if the author is not provided", async () => {
        const response = await request(app).post("/books").send({
          title: "To the Lighthouse",
          genre: "Modernist literature",
          ISBN: "978-0-15-690739-1",
        });
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal("Author is required.");
      });
    });
    it("returns an error if the genre is too long", async () => {
      const response = await request(app).post("/books").send({});
    });
  });

  describe("with records in the database", () => {
    let books;

    beforeEach(async () => {
      books = await Promise.all([
        Book.create({
          title: "The Great Gatsby two",
          author: "F. Scott Fitzgerald",
          genre: "Classic Literature",
          ISBN: "978-0-684-80146-2",
        }),
        Book.create({
          title: "1984",
          author: "George Orwell",
          genre: "Dystopian Fiction",
          ISBN: "978-0-14-103614-4",
        }),
        Book.create({
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          genre: "Classic Literature",
          ISBN: "978-0-446-31078-0",
        }),
      ]);
    });

    describe("GET /books", () => {
      it("gets all books records", async () => {
        const response = await request(app).get("/books");

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.author).to.equal(expected.author);
          expect(book.genre).to.equal(expected.genre);
          expect(book.ISBN).to.equal(expected.ISBN);
        });
      });
    });

    describe("GET /books/:id", () => {
      it("gets book record by id", async () => {
        const book = books[0];
        const response = await request(app).get(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(book.title);
        expect(response.body.author).to.equal(book.author);
        expect(response.body.ISBN).to.equal(book.ISBN);
      });

      it("returns a 404 if the book does not exist", async () => {
        const response = await request(app).get("/books/12345");
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The book could not be found.");
      });
    });

    describe("PATCH /books/:id", () => {
      it("updates books genre by id", async () => {
        const book = books[0];
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ genre: "Philosophical Fiction" });
        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedBookRecord.genre).to.equal("Philosophical Fiction");
      });

      it("returns a 404 if the book does not exist", async () => {
        const response = await request(app)
          .patch("/books/12345")
          .send({ genre: "Post-Apocalyptic Fiction" });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The book could not be found.");
      });
    });

    describe("DELETE /books/:id", () => {
      it("deletes book record by id", async () => {
        const book = books[0];
        const response = await request(app).delete(`/books/${book.id}`);
        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });

      it("returns a 404 if the reader does not exist", async () => {
        const response = await request(app).delete("/books/12345");
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The book could not be found.");
      });
    });
  });
});
