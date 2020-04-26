# Services API Documentation

Each service listed in [services](#services) corresponds to a PHP file in `/src/services` with the same name. The frontend communicates with the backend only through the files in such directory. **Any additional service the frontend might require, must be documented here according to the [guidelines](#guidelines).**

## Table of contents

<!-- TOC -->

- [Table of contents](#table-of-contents)
- [Guidelines](#guidelines)
    - [Naming convention](#naming-convention)
    - [Documenting a service](#documenting-a-service)
- [Services required on each view](#services-required-on-each-view)
- [Services](#services)
    - [READ_admin](#read_admin)
        - [Request](#request)
        - [Response](#response)
        - [Errors](#errors)
    - [READ_groups_GB_major](#read_groups_gb_major)
        - [Request](#request-1)
        - [Response](#response-1)
    - [READ_classes_GB_course_id_BY_group_id](#read_classes_gb_course_id_by_group_id)
        - [Request](#request-2)
        - [Response](#response-2)
    - [READ_classes_GB_weekday_BY_group_id](#read_classes_gb_weekday_by_group_id)
        - [Request](#request-3)
        - [Response](#response-3)
    - [READ_courses_BY_group_id](#read_courses_by_group_id)
        - [Request](#request-4)
        - [Response](#response-4)
    - [READ_classrooms](#read_classrooms)
        - [Request](#request-5)
        - [Response](#response-5)
    - [CREATE_class](#create_class)
        - [Request](#request-6)
        - [Response](#response-6)
        - [Errors](#errors-1)
    - [DELETE_class](#delete_class)
        - [Request](#request-7)
        - [Response](#response-7)
        - [Errors](#errors-2)
    - [UPDATE_class](#update_class)
        - [Request](#request-8)
        - [Response](#response-8)
        - [Errors](#errors-3)
    - [UPDATE_approve_group](#update_approve_group)
        - [Request](#request-9)
        - [Response](#response-9)

<!-- /TOC -->

## Guidelines

### Naming convention

Every service name begins with a CRUD verb and is followed by the target resource in lowercase. Optionally, additional specification can be provided if appropriate through the keywords BY and GB (group by). BY should only be used when not all resources from the DB are operated upon or when disambiguation is required. Every word is separated by an underscore.

EBNF syntax for service names:

```ebnf
(CREATE|READ|UPDATE|DELETE)_<resource>[_GB_<criterion>][_BY_<criterion>]
```

### Documenting a service

For each service, two subheadings must be provided: "Request" and "Response". An optional third subheading, "Errors", can be provided if necessary.

1. **Request**. Required HTTP method and data sent by the frontend required by the service (if any).
2. **Response**. Data sent by the service to the frontend. If no data is sent, write _No response body_. Specify HTTP status code if different from 200 OK.
3. **Errors**. HTTP error codes the service sets provided an error ocurred. The format for this section is a table; where the first column (named 'HTTP status code') indicates the HTTP status code, and the second column (named 'Description') describes the cases in which this status is set. If the request data is malformed, it is implicitly understood that 400 Bad Request must be issued.

## Services required on each view

| View |Service |
|---|---|
| Login | [READ_admin](#read_admin) |
| Groups Catalog | [READ_groups_GB_major](#read_groups_gb_major)<br>[READ_classes_GB_course_id_BY_group_id](#read_classes_gb_course_id_by_group_id)<br>[UPDATE_approve_group](#update_approve_group) |
| Groups Edit | [READ_courses_BY_group_id](#read_courses_by_group_id)<br>[READ_classes_GB_course_id_BY_group_id](#read_classes_gb_course_id_by_group_id)<br>[READ_classrooms](#read_classrooms)<br>[CREATE_class](#create_class)<br>[UPDATE_approve_group](#update_approve_group)<br>[DELETE_class](#delete_class)<br>[UPDATE_class](#update_class) |

## Services

### READ_admin

#### Request

HTTP method: POST

```bnf
{
  "username": <ZERO-PADDED-INTEGER(4)>,
  "password": <STRING>
}
```

#### Response

```bnf
{
  "names": <STRING>,
  "first_lname": <STRING>,
  "second_lname": <STRING>
}
```

#### Errors

| HTTP status code | Description |
|---|---|
|401 Unauthorized| Username-password pair does not match an admin. |

### READ_groups_GB_major

#### Request

HTTP method: GET

#### Response

```bnf
[
    {
        "major": <STRING>,
        "groups": [
            {
                "group_id": <INTEGER>,
                "approved": <BOOLEAN>,
                "group_letter": "A"-"Z",
                "semester": <INTEGER>
            }
        ]
    }
]
```

### READ_classes_GB_course_id_BY_group_id

#### Request

HTTP method: GET

```text
?group_id=<INTEGER>
```

#### Response

```bnf
[
    {
        "course_id": <INTEGER>,
        "classes":
        [
            {
                "class_id": <INTEGER>,
                "start_hour": <24-format-time>,
                "end_hour": <24-format-time>,
                "classroom_name": <STRING>,
                "weekday": ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")
            }
        ]
    }
]
```

### READ_classes_GB_weekday_BY_group_id

#### Request

HTTP method: GET

```text
?group_id=<INTEGER>
```

#### Response

```bnf
[
    {
        "weekday": ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"),
        "classes":
        [
            {
                "subject_name": <STRING>,
                "start_hour": <24-format-time>,
                "end_hour": <24-format-time>,
                "classroom": <STRING>
            }
        ]
    }
]
```

### READ_courses_BY_group_id

#### Request

HTTP method: GET

```text
?group_id=<INTEGER>
```

#### Response

```bnf
[
    {
        "course_id": <INTEGER>,
        "required_class_hours": <FLOAT>,
        "professor_full_name": <STRING>,
        "subject_name": <STRING>,
    }
]
```

### READ_classrooms

#### Request

HTTP method: GET

#### Response

```bnf
[<STRING>]
```

### CREATE_class

#### Request

HTTP method: POST

```bnf
{
    "start_hour": <24-hour-format>,
    "end_hour": <24-hour-format>,
    "classroom_name": <STRING>,
    "course_id": <INTEGER>,
    "weekday": ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")
}
```

#### Response

HTTP status code: 201 Created

_No response body_

#### Errors

| HTTP status code | Description |
|---|---|
| 409 Conflict | Class can't be inserted because a class in a different group already requires the professor or classroom in a superposing time. |

### DELETE_class

#### Request

HTTP method: DELETE

```text
?class_id=<INTEGER>
```

#### Response

HTTP status code: 204 No Content

_No response body_

#### Errors

| HTTP status code | Description |
|---|---|
| 404 Not Found | Class with provided class_id not found. |

### UPDATE_class

#### Request

HTTP method: PUT

```bnf
{
    "class_id": <INTEGER>,
    "start_hour": <24-format-time>,
    "end_hour": <24-format-time>,
    "classroom_name": <STRING>,
    "course_id": <INTEGER>,
    "weekday": ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")
}
```

#### Response

HTTP status code: 204 No Content

_No response body_

#### Errors

| HTTP status code | Description |
|---|---|
| 409 Conflict | Class can't be updated because a class in a different group already requires the professor or classroom in a superposing time. |

### UPDATE_approve_group

#### Request

HTTP method: PUT

```bnf
{
    "group_id": <INTEGER>,
    "approved": <BOOLEAN>
}
```

#### Response

HTTP status code: 204 No Content

_No response body_
