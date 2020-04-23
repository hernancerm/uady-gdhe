class Courses {
  refresh(group_id) {
    new ServicesProvider().readCourses(group_id, (courses) => {
      this.courses = JSON.parse(courses);
      new ServicesProvider().readClasses(group_id, (jsonClasses) => {
        var classes = JSON.parse(jsonClasses);
        Array.prototype.forEach.call(this.courses, (course) => {
          course.classes = classes.find(function (sessions) {
            return sessions.course_id == course.course_id;
          }).classes;
        });
        fillselectCourses(this.courses);
      });
    });
  }

  get(course_id) {
    return this.courses.find(function (course) {
      return course.course_id == course_id;
    });
  }
}
