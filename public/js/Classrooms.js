class Classrooms {
  constructor() {
    new ServicesProvider().readClassrooms((newClassrooms) => {
      this.classrooms = JSON.parse(newClassrooms);
    });
  }

  getClassrooms = () => this.classrooms;
}
