import { expect } from "chai";
import fetch from "node-fetch";

import ServicesProvider from "../ServicesProvider.mjs";

// Workaround of injecting fetch impl to ServicesProvider.
global.fetch = fetch;

describe("ServicesProvider tests", () => {
  const services = new ServicesProvider();

  it("Services instance should exist", () => {
    expect(services).to.not.be.null;
  });

  it("Should READ admin BY credentials", () => {
    return services
      .logInWithCredentials({
        username: "0001",
        password: "123",
      })
      .then((response) => {
        expect(response.status).to.equal(200);
        return response.json();
      })
      .then((body) => {
        expect(body.names).to.be.a("string");
        expect(body.first_lname).to.be.a("string");
        expect(body.second_lname).to.be.a("string");
      });
  });

  it("Should READ student BY credentials", () => {
    return services
      .logInStudentWithCredentials({
        username: "0001",
        password: "123",
      })
      .then((response) => {
        expect(response.status).to.equal(200);
        return response.json();
      })
      .then((body) => {
        expect(body.names).to.be.a("string");
        expect(body.first_lname).to.be.a("string");
        expect(body.second_lname).to.be.a("string");
      });
  });

  it("Should READ professor BY credentials", () => {
    return services
      .logInProfessorWithCredentials({
        username: "0001",
        password: "123",
      })
      .then((response) => {
        expect(response.status).to.equal(200);
        return response.json();
      })
      .then((body) => {
        expect(body.names).to.be.a("string");
        expect(body.first_lname).to.be.a("string");
        expect(body.second_lname).to.be.a("string");
      });
  });

  it("Should READ groups GB major", () => {
    return services
      .readGroups()
      .then((response) => {
        expect(response.status).to.equal(200);
        return response.json();
      })
      .then((body) => {
        expect(body).to.be.an("array");
        expect(body).to.not.be.empty;
        expect(body[0].major).to.be.a("string");
        expect(body[0].groups).to.be.an("array");
      });
  });

  it("Should READ classrooms", () => {
    return services
      .readClassrooms()
      .then((response) => {
        expect(response.status).to.equal(200);
        return response.json();
      })
      .then((body) => {
        expect(body).to.be.an("array");
      });
  });

  it("Should READ group BY group id", () => {
    return services
      .readGroup(1)
      .then((response) => {
        expect(response.status).to.equal(200);
        return response.json();
      })
      .then((body) => {
        expect(body.approved).to.be.a("boolean");
        expect(body.group_letter).to.be.a("string");
        expect(body.semester).to.be.a("number");
        expect(body.major).to.be.a("string");
      });
  });

  it("Should READ courses BY group id", () => {
    return services
      .readCourses(1)
      .then((response) => {
        expect(response.status).to.equal(200);
        return response.json();
      })
      .then((body) => {
        expect(body).to.be.an("array");
        expect(body).to.not.be.empty;
        expect(body[0].course_id).to.be.a("number");
        expect(body[0].required_class_hours).to.be.a("number");
        expect(body[0].professor_full_name).to.be.a("string");
        expect(body[0].subject_name).to.be.a("string");
      });
  });

  it("Should READ classes GB course id BY group id", () => {
    return services
      .readClasses(1)
      .then((response) => {
        expect(response.status).to.equal(200);
        return response.json();
      })
      .then((body) => {
        expect(body).to.be.an("array");
        expect(body).to.not.be.empty;
        expect(body[0].course_id).to.be.a("number");
        expect(body[0].classes).to.be.an("array");
      });
  });

  it("Should READ classes GB weekday BY group id", () => {
    return services
      .readGroupClasses(1)
      .then((response) => {
        expect(response.status).to.equal(200);
        return response.json();
      })
      .then((body) => {
        expect(body).to.be.an("array");
        expect(body).to.not.be.empty;
        expect(body[0].weekday).to.be.a("string");
        expect(body[0].classes).to.be.an("array");
      });
  });

  it("Should READ approved classes GB weekday BY professor id", () => {
    return services
      .readProfessorClasses(1)
      .then((response) => {
        expect(response.status).to.equal(200);
        return response.json();
      })
      .then((body) => {
        expect(body).to.be.an("array");
        expect(body).to.not.be.empty;
        expect(body[0].weekday).to.be.a("string");
        expect(body[0].classes).to.be.an("array");
      });
  });

  it("Should UPDATE approve group", () => {
    return services
      .approveGroup(1, true)
      .then((response) => expect(response.status).to.equal(204))
      .then(() =>
        services
          .readGroup(1)
          .then((response) => {
            expect(response.status).to.equal(200);
            return response.json();
          })
          .then((body) => {
            expect(body.approved).to.be.true;
          })
      );
  });
});
