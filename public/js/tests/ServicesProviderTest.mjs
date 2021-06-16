import { expect } from "chai";
import ServicesProvider from "../ServicesProvider.mjs";

describe("ServicesProvider tests", () => {
  let services;

  before(() => {
    services = new ServicesProvider();
  });

  it("Services instance should exist", () => {
    expect(services).to.not.be.null;
  });
});
