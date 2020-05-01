class Courses {
  refresh(group_id) {
    console.log("refresh");

    new ServicesProvider().readCourses(group_id, (courses) => {
      this.courses = JSON.parse(courses);
      new ServicesProvider().readClasses(group_id, (jsonClasses) => {
        var classes = JSON.parse(jsonClasses);
        Array.prototype.forEach.call(this.courses, (course) => {
          course.classes = classes.find(function (sessions) {
            return sessions.course_id == course.course_id;
          }).classes;
        });
        this.classesCreated = new Array();
        this.classesEdited = new Array();
        this.classesDeleted = new Array();
        fillselectCourses(this.courses);
      });
    });
  }

  get(course_id) {
    return this.courses.find(function (course) {
      return course.course_id == course_id;
    });
  }

  addCreatedClass(item, course_id) {
    this.classesCreated.push(
      new Object({
        class: item,
        course_id: course_id,
      })
    );
  }

  addEditedClass(item, course_id) {
    var newClassEdited = this.classesCreated.find(function (session) {
      return item.class_id == session.class.class_id;
    });
    if (newClassEdited) {
      newClassEdited.class = item;
    } else {
      var classEdited = this.classesEdited.find(function (session) {
        return item.class_id == session.class.class_id;
      });
      if (classEdited) {
        classEdited.class = item;
      } else {
        this.classesEdited.push(
          new Object({ class: item, course_id: course_id })
        );
      }
    }
  }

  addDeletedClass(item, course_id) {
    var newClassDeleted = this.classesCreated.find(function (session) {
      return item.class_id == session.class.class_id;
    });
    if (newClassDeleted) {
      this.classesCreated = this.classesCreated.filter(
        (session) => item.class_id != session.class.class_id
      );
    } else {
      var classDeleted = this.classesEdited.find(function (session) {
        return item.class_id == session.class.class_id;
      });
      if (classDeleted) {
        this.classesEdited = this.classesEdited.filter(
          (session) => item.class_id != session.class.class_id
        );
      }
      this.classesDeleted.push(
        new Object({ class: item, course_id: course_id })
      );
    }
  }

  saveChanges(group_id) {
    var $this = this;
    var successList = new Array();
    var errorList = new Array();
    var countTransacts =
      this.classesCreated.length +
      this.classesEdited.length +
      this.classesDeleted.length;

    this.classesCreated.forEach(function (item) {
      var addSuccess = function () {
        successList.push(new Object({ transcact: "create", class: item }));
        countTransacts--;
        if (countTransacts == 0) $this.refresh(group_id);
      };
      var addError = function () {
        errorList.push(new Object({ transcact: "create", class: item }));
        countTransacts--;
        if (countTransacts == 0) $this.refresh(group_id);
      };
      new ServicesProvider().createClass(item, addSuccess, addError);
    });

    this.classesEdited.forEach(function (item) {
      var addSuccess = function () {
        successList.push(new Object({ transcact: "edit", class: item }));
        countTransacts--;
        if (countTransacts == 0) $this.refresh(group_id);
      };
      var addError = function () {
        errorList.push(new Object({ transcact: "edit", class: item }));
        countTransacts--;
        if (countTransacts == 0) $this.refresh(group_id);
      };
      new ServicesProvider().updateClass(item, addSuccess, addError);
    });

    this.classesDeleted.forEach(function (item) {
      var addSuccess = function () {
        successList.push(new Object({ transcact: "delete", class: item }));
        countTransacts--;
        if (countTransacts == 0) $this.refresh(group_id);
      };
      var addError = function (data) {
        errorList.push(new Object({ transcact: "delete", class: item }));
        countTransacts--;
        if (countTransacts == 0) $this.refresh(group_id);
      };
      new ServicesProvider().deleteClass(item, addSuccess, addError);
    });
  }
}
