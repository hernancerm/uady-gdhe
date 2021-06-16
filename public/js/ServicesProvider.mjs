export default class ServicesProvider {
  constructor(baseUrl) {
    if (baseUrl === undefined) {
      // Development base url.
      this.baseUrl = "http://localhost/GDHE";
    } else {
      this.baseUrl = baseUrl;
    }
  }

  logInWithCredentials(data) {
    return fetch(`${this.baseUrl}/src/services/READ_admin_BY_credentials.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  logInStudentWithCredentials(data) {
    return fetch(
      `${this.baseUrl}/src/services/READ_student_BY_credentials.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
  }

  logInProfessorWithCredentials(data) {
    return fetch(
      `${this.baseUrl}/src/services/READ_professor_BY_credentials.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
  }

  readGroups() {
    return fetch(`${this.baseUrl}/src/services/READ_groups_GB_major.php`);
  }

  readClassrooms() {
    return fetch(`${this.baseUrl}/src/services/READ_classrooms.php`);
  }

  readGroup(group_id) {
    return fetch(
      `${this.baseUrl}/src/services/READ_group_BY_group_id.php?group_id=${group_id}`
    );
  }

  readCourses(group_id) {
    return fetch(
      `${this.baseUrl}/src/services/READ_courses_BY_group_id.php?group_id=${group_id}`
    );
  }

  readClasses(group_id) {
    return fetch(
      `${this.baseUrl}/src/services/READ_classes_GB_course_id_BY_group_id.php?group_id=${group_id}`
    );
  }

  readGroupClasses(group_id) {
    return fetch(
      `${this.baseUrl}/src/services/READ_classes_GB_weekday_BY_group_id.php?group_id=${group_id}`
    );
  }

  readProfessorClasses(professor_id) {
    return fetch(
      `${this.baseUrl}/src/services/READ_approved_classes_GB_weekday_BY_professor_id.php?professor_id=${professor_id}`
    );
  }

  approveGroup(group_id, approved) {
    var data = {
      group_id: parseInt(group_id),
      approved: Boolean(approved),
    };

    return fetch(`${this.baseUrl}/src/services/UPDATE_approve_group.php`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  createClass(item) {
    var data = {
      start_hour: item.class.start_hour,
      end_hour: item.class.end_hour,
      classroom_name: item.class.classroom_name,
      course_id: parseInt(item.course_id),
      weekday: item.class.weekday,
    };

    return fetch(`${this.baseUrl}/src/services/CREATE_class.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  updateClass(item) {
    var data = {
      class_id: parseInt(item.class.class_id),
      start_hour: item.class.start_hour,
      end_hour: item.class.end_hour,
      classroom_name: item.class.classroom_name,
      course_id: parseInt(item.course_id),
      weekday: item.class.weekday,
    };

    return fetch(`${this.baseUrl}/src/services/UPDATE_class.php`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  deleteClass(item) {
    var id = item.class.class_id;

    return fetch(
      `${this.baseUrl}/src/services/DELETE_class.php?class_id=${id}`
    );
  }
}
