import { expect } from "chai";
import ServicesProvider from "../ServicesProvider.mjs";

describe("ServicesProvider tests", function () {
  let services;

  before(function () {
    services = new ServicesProvider();
  });

  it("Services instance should exist", function () {
    expect(services).to.not.be.null;
  });
});
