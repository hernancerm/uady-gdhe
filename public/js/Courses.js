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
        new ServicesProvider().readGroupClasses(
          idGroupSelected,
          (collegeClasses) => {
            spinner.fadeOut(1000);
            visualizer.render(JSON.parse(collegeClasses));
          }
        );
        changes(false);
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
    changes(true);
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
    changes(true);
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
    changes(true);
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

  approveGroup(group_id, isApprove) {
    var $this = this;
    var flag = true;
    if (
      this.classesCreated.length > 0 ||
      this.classesEdited.length > 0 ||
      this.classesDeleted.length > 0
    ) {
      approved(
        false,
        "Necesita guardar los cambios de las clases antes de aprobar el horario."
      );
    } else {
      if (isApprove) {
        $this.courses.forEach(function (course) {
          if (
            $this.calcAsigHours(course.classes) < course.required_class_hours
          ) {
            flag = false;
          }
        });
      }
      if (flag)
        new ServicesProvider().approveGroup(
          group_id,
          isApprove,
          function () {
            approved(true, "Horario aprobado con éxito");
          },
          function () {
            approved(false, "Ups... Ocurrió un error inesperado.");
          }
        );
      else
        approved(
          false,
          "Necesita asignar todas las horas requeridas de las clases correspondientes para aprobar el horario."
        );
    }
  }

  calcAsigHours(classes) {
    var hours = 0;
    classes.forEach((session) => {
      var timeStart = new Date("01/01/1999 " + session.start_hour);
      var timeEnd = new Date("01/01/1999 " + session.end_hour);
      hours += (timeEnd.getTime() - timeStart.getTime()) / 3600000; //3,600,000= hours(60)*minutes(60)*milliseconds(1000);
    });
    return hours;
  }
}
