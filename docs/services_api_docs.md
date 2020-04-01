# Services API Documentation

Each service listed in [services](#services) corresponds to a PHP file in `/src/services` with the same name. The frontend communicates with the backend only through the files in such directory. **Any additional service the frontend might require, must be documented here according to the [guidelines](#guidelines).**

## Table of contents

<!-- TOC -->

- [Services API Documentation](#services-api-documentation)
    - [Table of contents](#table-of-contents)
    - [Guidelines](#guidelines)
        - [Naming convention](#naming-convention)
        - [Documenting a service](#documenting-a-service)
    - [Services required on each view](#services-required-on-each-view)
    - [Services](#services)
        - [READ_admin_BY_credentials](#read_admin_by_credentials)
            - [Request](#request)
            - [Response](#response)
            - [Errors](#errors)
        - [READ_groups_GB_major](#read_groups_gb_major)
            - [Request](#request-1)
            - [Response](#response-1)
        - [READ_classes_BY_group_id](#read_classes_by_group_id)
            - [Request](#request-2)
            - [Response](#response-2)
        - [READ_courses_BY_group_id](#read_courses_by_group_id)
            - [Request](#request-3)
            - [Response](#response-3)
        - [READ_classrooms](#read_classrooms)
            - [Request](#request-4)
            - [Response](#response-4)
        - [CREATE_class](#create_class)
            - [Request](#request-5)
            - [Response](#response-5)
            - [Errors](#errors-1)
        - [UPDATE_approve_group](#update_approve_group)
            - [Request](#request-6)
            - [Response](#response-6)

<!-- /TOC -->

## Guidelines

### Naming convention

Every service name begins with a CRUD verb and is followed by the target resource in lowercase. Optionally, additional specification can be provided if appropriate through the keywords BY and GB (group by). Every word is separated by an underscore.

EBNF syntax for service names:

```ebnf
(CREATE|READ|UPDATE|DELETE)_<resource>[_GB_<criterion>][_BY_<criterion>]
```

### Documenting a service

For each service, two subheadings must be provided: "Request" and "Response". An optional third subheading, "Errors", can be provided if necessary.

1. **Request**. Required HTTP method and data sent by the frontend required by the service (if any).
2. **Response**. Data sent by the service to the frontend. If no data is sent, write _No response body_.
3. **Errors**. HTTP error codes the service sets provided an error ocurred. The format for this section is a table; where the first column (named 'HTTP status code') indicates the HTTP status code, and the second column (named 'Description') describes the cases in which this status is set. If the request data is malformed, it is implicitly understood that `400 Bad Request` must be issued.

## Services required on each view

| View |Service |
|---|---|
| Login | [READ_admin_BY_credentials](#read_admin_by_credentials) |
| Groups Catalog | [READ_groups_GB_major](#read_groups_gb_major)<br>[READ_classes_BY_group_id](#read_classes_by_group_id)<br>[UPDATE_approve_group](#put_approve_group) |
| Groups Edit | [READ_courses_BY_group_id](#read_courses_by_group_id)<br>[READ_classes_BY_group_id](#read_classes_by_group_id)<br>[READ_classrooms](#read_classrooms)<br>[CREATE_class](#create_class)<br>[UPDATE_approve_group](#put_approve_group) |

## Services

### READ_admin_BY_credentials

#### Request

HTTP method: POST

```json
{
  "username": "<admin_id>",
  "password": "<password>"
}
```

#### Response

```json
{
  "names": "<names>",
  "first_lname": "<first_last_name>",
  "second_lname": "<second_last_name>"
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

```json
{
    "<major>":
        [
            {
                "group_id": "<INTEGER>",
                "approved": "(0 | 1)",
                "group_letter": "<'A'-'Z'>",
                "semester": "<INTEGER>"
            }
        ]

}
```

### READ_classes_BY_group_id

#### Request

HTTP method: GET

```json
{
    "group_id": "<INTEGER>"
}
```

#### Response

```json
[
    {
        "start_hour": "<24-format>",
        "end_hour": "<24-format>",
        "classroom_name": "<classroom>",
        "course_id": "<INTEGER>",
        "weekday": "('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')"
    }
]
```

### READ_courses_BY_group_id

#### Request

HTTP method: GET

```json
{
    "group_id": "<INTEGER>"
}
```

#### Response

```json
[
    {
        "course_id": "<INTEGER>",
        "professor_name": "<name>",
        "subject_name": "<name>",
        "required_hours": "<FLOAT>"
    }
]
```

### READ_classrooms

#### Request

HTTP method: GET

#### Response

```json
["<classroom_name>"]
```

### CREATE_class

#### Request

HTTP method: POST

```json
{
    "start_hour": "<24-format>",
    "end_hour": "<24-format>",
    "classroom_name": "<classroom>",
    "course_id": "<INTEGER>",
    "weekday": "('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')"
}
```

#### Response

_No response body_

#### Errors

| HTTP status code | Description |
|---|---|
| 409 Conflict | Class can't be inserted because a class in a different group already requires the professor or classroom in a superposing time. |

### UPDATE_approve_group

#### Request

HTTP method: PUT

```json
{
    "group_id": "<INTEGER>",
    "approved": "(0 | 1)"
}
```

#### Response

_No response body_
