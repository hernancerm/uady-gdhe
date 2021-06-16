import ServicesProvider from "./ServicesProvider.mjs";

export default class Classrooms {
  constructor() {
    new ServicesProvider()
      .readClassrooms()
      .then((response) => response.json())
      .then((newClassrooms) => {
        this.classrooms = newClassrooms;
      });
  }

  getClassrooms = () => this.classrooms;
}
