import { expect } from "chai";
import fetch from "node-fetch";

import ServicesProvider from "../ServicesProvider.mjs";

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
      .then((response) => expect(response.status).to.equal(200));
  });

  it("Should READ student BY credentials", () => {
    return services
      .logInStudentWithCredentials({
        username: "0001",
        password: "123",
      })
      .then((response) => expect(response.status).to.equal(200));
  });

  it("Should READ professor BY credentials", () => {
    return services
      .logInProfessorWithCredentials({
        username: "0001",
        password: "123",
      })
      .then((response) => expect(response.status).to.equal(200));
  });

  it("Should READ groups GB major", () => {
    return services
      .readGroups()
      .then((response) => expect(response.status).to.equal(200));
  });

  it("Should READ classrooms", () => {
    return services
      .readClassrooms()
      .then((response) => expect(response.status).to.equal(200));
  });

  it("Should READ group BY group id", () => {
    return services
      .readGroup(1)
      .then((response) => expect(response.status).to.equal(200));
  });

  it("Should READ courses BY group id", () => {
    return services
      .readCourses(1)
      .then((response) => expect(response.status).to.equal(200));
  });

  it("Should READ classes GB course id BY group id", () => {
    return services
      .readClasses(1)
      .then((response) => expect(response.status).to.equal(200));
  });

  it("Should READ classes GB weekday BY group id", () => {
    return services
      .readGroupClasses(1)
      .then((response) => expect(response.status).to.equal(200));
  });

  it("Should READ classes GB weekday BY professor id", () => {
    return services
      .readProfessorClasses(1)
      .then((response) => expect(response.status).to.equal(200));
  });

  it("Should UPDATE approve group", () => {
    return services
      .approveGroup(1, true)
      .then((response) => expect(response.status).to.equal(204));
  });
});
