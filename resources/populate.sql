USE gdhe;

/* Subjects */
INSERT INTO subject (name, required_class_hours) VALUES('Probabilidad', 4.5);
INSERT INTO subject (name, required_class_hours) VALUES('Diseño de UI', 3);
INSERT INTO subject (name, required_class_hours) VALUES('Cálculo II', 3);
INSERT INTO subject (name, required_class_hours) VALUES('Arquitectura de SW', 2);

/* Classrooms */
INSERT INTO classroom (name) VALUES ('H8');
INSERT INTO classroom (name) VALUES ('C9');
INSERT INTO classroom (name) VALUES ('CC8');
INSERT INTO classroom (name) VALUES ('CC1');
INSERT INTO classroom (name) VALUES ('D2');

/* Majors */
INSERT INTO major (name) VALUES ('Ingeniería de Software');
INSERT INTO major (name) VALUES ('Ciencias de la Computación');

/* Groups */
INSERT INTO `group` (group_letter, semester, major_id) VALUES ('A', 6, 1);
INSERT INTO `group` (group_letter, semester, major_id) VALUES ('B', 6, 1);
INSERT INTO `group` (group_letter, semester, major_id) VALUES (NULL, 3, 2);

/* Students */
INSERT INTO student (names, first_lname, second_lname, password, major_id, group_id)
VALUES ('Hernán', 'Cervera', 'Manzanilla', '123', 1, 2);
INSERT INTO student (names, first_lname, second_lname, password, major_id, group_id)
VALUES ('Emilia Carla', 'Gutiérrez', 'Cuevas', '123', 1, 2);
INSERT INTO student (names, first_lname, second_lname, password, major_id, group_id)
VALUES ('Damián', 'Soledad', 'Bolaños', '123', 1, 2);
INSERT INTO student (names, first_lname, second_lname, password, major_id, group_id)
VALUES ('José', 'Padilla', 'Durán', '123', 2, 2);
INSERT INTO student (names, first_lname, second_lname, password, major_id, group_id)
VALUES ('Juan', 'Castellanos', 'Cervantes', '123', 2, 2);
INSERT INTO student (names, first_lname, second_lname, password, major_id, group_id)
VALUES ('Lucía', 'Peraza', 'Góngora', '123', 2, 2);

/* Professors */
INSERT INTO professor (names, first_lname, second_lname, password)
VALUES ('Diódora', 'Cantún', 'Pech', '123');
INSERT INTO professor (names, first_lname, second_lname, password)
VALUES ('Fabio', 'Cantún', 'Pech', '123');
INSERT INTO professor (names, first_lname, second_lname, password)
VALUES ('Juan', 'Garcilazo', 'Ortiz', '123');
INSERT INTO professor (names, first_lname, second_lname, password)
VALUES ('Diego', 'García', 'Peraza', '123');
INSERT INTO professor (names, first_lname, second_lname, password)
VALUES ('Santiago', 'Salinas', 'Santana', '123');

/* Admins */
INSERT INTO admin (names, first_lname, second_lname, password)
VALUES ('Nieves', 'Palmera', 'Palmira', '123');
INSERT INTO admin (names, first_lname, second_lname, password)
VALUES ('Edgar', 'Allan', 'Poe', '123');
INSERT INTO admin (names, first_lname, second_lname, password)
VALUES ('Sofía', 'Vergara', 'Vergara', '123');

/* Course */
/* Group #1 */
INSERT INTO course (professor_id, subject_id, group_id) VALUES (1, 1, 1);
INSERT INTO course (professor_id, subject_id, group_id) VALUES (2, 2, 1);
INSERT INTO course (professor_id, subject_id, group_id) VALUES (3, 4, 1);
/* Group #2 */
INSERT INTO course (professor_id, subject_id, group_id) VALUES (4, 1, 2);
INSERT INTO course (professor_id, subject_id, group_id) VALUES (1, 2, 2);
INSERT INTO course (professor_id, subject_id, group_id) VALUES (2, 3, 2);
/* Group #3 */
INSERT INTO course (professor_id, subject_id, group_id) VALUES (4, 2, 3);
INSERT INTO course (professor_id, subject_id, group_id) VALUES (3, 3, 3);
INSERT INTO course (professor_id, subject_id, group_id) VALUES (5, 4, 3);

/* Classes */
/* Group #1 */
INSERT INTO class (start_hour, end_hour, weekday, classroom_id, course_id)
VALUES ('09:00:00', '10:30:00', 'mon', 1, 1);
INSERT INTO class (start_hour, end_hour, weekday, classroom_id, course_id)
VALUES ('10:30:00', '12:00:00', 'mon', 1, 2);
INSERT INTO class (start_hour, end_hour, weekday, classroom_id, course_id)
VALUES ('09:00:00', '10:30:00', 'wed', 2, 3);
INSERT INTO class (start_hour, end_hour, weekday, classroom_id, course_id)
VALUES ('10:30:00', '12:00:00', 'wed', 2, 1);
INSERT INTO class (start_hour, end_hour, weekday, classroom_id, course_id)
VALUES ('10:30:00', '12:00:00', 'fri', 5, 3);
/* Group #2 */
INSERT INTO class (start_hour, end_hour, weekday, classroom_id, course_id)
VALUES ('09:00:00', '10:30:00', 'mon', 2, 4);
INSERT INTO class (start_hour, end_hour, weekday, classroom_id, course_id)
VALUES ('10:30:00', '12:00:00', 'mon', 2, 5);
INSERT INTO class (start_hour, end_hour, weekday, classroom_id, course_id)
VALUES ('09:00:00', '10:30:00', 'wed', 1, 6);
INSERT INTO class (start_hour, end_hour, weekday, classroom_id, course_id)
VALUES ('10:30:00', '12:00:00', 'wed', 1, 4);
INSERT INTO class (start_hour, end_hour, weekday, classroom_id, course_id)
VALUES ('10:30:00', '12:00:00', 'fri', 1, 5);
/* Group #3 */
INSERT INTO class (start_hour, end_hour, weekday, classroom_id, course_id)
VALUES ('12:30:00', '14:00:00', 'tue', 2, 7);
INSERT INTO class (start_hour, end_hour, weekday, classroom_id, course_id)
VALUES ('14:00:00', '15:30:00', 'tue', 2, 8);
INSERT INTO class (start_hour, end_hour, weekday, classroom_id, course_id)
VALUES ('12:30:00', '14:00:00', 'thu', 1, 9);
INSERT INTO class (start_hour, end_hour, weekday, classroom_id, course_id)
VALUES ('14:00:00', '15:30:00', 'thu', 1, 7);