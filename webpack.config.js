const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    index: "./public/js/index.js",
    login: "./public/js/login.js",
    professor_schedule: "./public/js/professor_schedule.js",
    student_schedule: "./public/js/student_schedule.js",
  },
  output: {
    path: path.resolve(__dirname, "./public/bundles"),
    filename: "[name]_bundle.js",
  },
};
