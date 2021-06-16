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
    return services.logInWithCredentials({
      username: "0001",
      password: "123",
    });
  });
});
