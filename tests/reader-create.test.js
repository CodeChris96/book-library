const { Reader } = require("../src/models");
const { it } = require("mocha");
const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");

describe("/readers", () => {
  before(async () => await Reader.sequelize.sync({ force: true }));
  beforeEach(async () => {
    await Reader.destroy({ where: {} });
  });
  describe("with no records in the database", () => {
    describe("POST /readers", () => {
      it("creates a new reader in the database", async () => {
        const response = await request(app).post("/readers").send({
          name: "Chris Edwards",
          email: "chrisedeards@email.com",
        });
        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });
        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal("Chris Edwards");
        expect(newReaderRecord.name).to.equal("Chris Edwards");
        expect(newReaderRecord.email).to.equal("chrisedeards@email.com");
      });
    });
  });
});
