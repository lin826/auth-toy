const Request = require("request");
const server = require("../../src/auth-server");


// Test on Express.js usual performance
// ref: https://www.thepolyglotdeveloper.com/2017/08/unit-testing-node-js-application-jasmine-testing-framework/
describe("A suite", function() {
  afterAll(() => {
      server.close();
  });

  describe("GET /.well-known/openid-configuration", () => {
    var data = {};

    beforeAll((done) => {
      Request.get("http://localhost:3000/.well-known/openid-configuration", (_error, res, _body) => {
        data.status = res.statusCode;
        data.body = JSON.parse(res.body);
        done();
      });
    });

    it("Status 200", () => {
      expect(data.status).toBe(200);
    });

    it("Body", () => {
      expect(data.body.authorization_endpoint).toBeDefined;
    });
  });


  describe("GET /", () => {
    var data = {};

    beforeAll((done) => {
      Request.get("http://localhost:3000/", (_error, res, _body) => {
        data.status = res.statusCode;
        data.body = res.body;
        done();
      });
    });

  it("Status 404", () => {
        expect(data.status).toBe(404);
    });

    it("Body", () => {
      expect(data.body).toBeUndefined;
    });
  });
});
