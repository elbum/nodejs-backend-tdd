const app = require("../../index");
const request = require("supertest");
const should = require("should");
const models = require("../../models");

describe("GET /users는 ", () => {
  const users = [{ name: "alice" }, { name: "bek" }, { name: "happy" }];
  before(() => {
    return models.sequelize.sync({ force: true });
  });
  before(() => {
    return models.User.bulkCreate(users);
  }); // make 1 line
  describe("성공시", () => {
    it("유저객체를 담은 배열로 응답한다", done => {
      request(app)
        .get("/users")
        .end((err, res) => {
          res.body.should.be.instanceOf(Array);
          console.log(res.body);
          done();
        });
    });

    it("최대 limit 갯수만큼 응답한다", done => {
      request(app)
        .get("/users?limit=2")
        .end((err, res) => {
          console.log(res.body);
          res.body.should.have.lengthOf(2);
          done();
        });
    });
  });

  describe("실패시", () => {
    it("limit 이 숫자형이 아닌면 400 을 응답한다", done => {
      request(app)
        .get("/users?limit=two")
        .expect(400)
        .end(done);
    });
  });

  describe("USER ID 는 !~", () => {
    it("id 가 1인 유저객체를 반환한다", done => {
      request(app)
        .get("/users/1")
        .end((err, res) => {
          res.body.should.have.property("id", 1);
          done();
        });
    });
  });

  describe("실패시!!-", () => {
    it("id 가 숫자가 아닐때", done => {
      request(app)
        .get("/users/one")
        .expect(400)
        .end(done);
    });

    it("id 로 유저를 찾을 수 없을때", done => {
      request(app)
        .get("/users/999")
        .expect(404)
        .end(done);
    });
  });
});

describe("GET /users는 ", () => {
  describe("성공시", () => {
    it("204 응답한다", done => {
      request(app)
        .delete("/users/1")
        .expect(204)
        .end(done);
    });
  });

  describe("실패시", () => {
    it("id 가 숫자가 아니면 400 응답한다", done => {
      request(app)
        .delete("/users/one")
        .expect(400)
        .end(done);
    });
  });
});

describe("POST /", () => {
  const users = [{ name: "alice" }, { name: "bek" }, { name: "happy" }];
  before(() => {
    return models.sequelize.sync({ force: true });
  });
  before(() => {
    return models.User.bulkCreate(users);
  }); // make 1 line
  let name = "daniel";
  let body;

  before(done => {
    request(app)
      .post("/users")
      .send({ name })
      .expect(201)
      .end((err, res) => {
        body = res.body;
        done();
      });
  });

  it("생성된 유저 객체를 반환한다", () => {
    body.should.have.property("id");
  });

  it("입력된 name을 반환한다", () => {
    body.should.have.property("name", name);
  });
});

describe("POST 실패", () => {
  const users = [{ name: "alice" }, { name: "bek" }, { name: "happy" }];
  before(() => {
    return models.sequelize.sync({ force: true });
  });
  before(() => {
    return models.User.bulkCreate(users);
  }); // make 1 line

  it("name 파라미터 누락시 400을 반환한다", done => {
    request(app)
      .post("/users")
      .send({})
      .expect(400)
      .end(done);
  });

  it("name 중복이면 409을 반환한다", done => {
    request(app)
      .post("/users")
      .send({ name: "happy" })
      .expect(409)
      .end(done);
  });
});

describe.only("PUT /", () => {
  const users = [{ name: "alice" }, { name: "bek" }, { name: "happy" }];
  before(() => {
    return models.sequelize.sync({ force: true });
  });
  before(() => {
    return models.User.bulkCreate(users);
  }); // make 1 line

  describe("성공시", () => {
    it("put성공시 변경된 name을 반환한다.", done => {
      const name = "charlie";

      request(app)
        .put("/users/3")
        .send({ name })
        .end((err, res) => {
          res.body.should.have.property("name", name);
          done();
        });
    });

    // it("name 중복이면 409을 반환한다", done => {
    //   request(app)
    //     .post("/users")
    //     .send({ name: "happy" })
    //     .expect(409)
    //     .end(done);
    // });
    //   });

    describe("실패시", () => {
      it("id 가 정수가 아닐때 400", done => {
        request(app)
          .put("/users/one")
          .expect(400)
          .end(done);
      });
      it("name 없을때 404 반환한다", done => {
        request(app)
          .put("/users/1")
          //   .send({ name: "dummy" })
          .expect(404)
          .end(done);
      });

      it("중복일때 409 반환한다", done => {
        request(app)
          .put("/users/3")
          .send({ name: "alice" })
          .expect(409)
          .end(done);
      });
    });
  });
});
