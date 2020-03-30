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
        - [GET_user_BY_credentials](#get_user_by_credentials)
            - [Request](#request)
            - [Response](#response)
            - [Error HTTP code](#error-http-code)
        - [GET_groups_GB_major](#get_groups_gb_major)
            - [Response](#response-1)
        - [GET_classes_BY_group_id](#get_classes_by_group_id)
            - [Request](#request-1)
            - [Response](#response-2)
        - [GET_courses_BY_group_id](#get_courses_by_group_id)
            - [Request](#request-2)
            - [Response](#response-3)
        - [GET_classrooms](#get_classrooms)
            - [Response](#response-4)
        - [POST_class](#post_class)
            - [Request](#request-3)
            - [Error HTTP code](#error-http-code-1)
        - [POST_approve_group](#post_approve_group)
            - [Request](#request-4)

<!-- /TOC -->

## Guidelines

### Naming convention

Every service name begins with an uppercase HTTP verb and is followed by the target resource in lowercase. Optionally, additional specification can be provided if appropriate through the keywords BY and GB (group by). Every word is separated by an underscore.

EBNF syntax for service names:

```ebnf
(GET|POST|PUT|DELETE)_<resource>[_GB_<criterion>][_BY_<criterion>]
```

### Documenting a service

For each service, three subheadings can be provided: (1) request, (2) response and (3) errors.

1. **Request**. Data sent by the frontend required by the service. Optional if the service doesn't need input data to understand what it should return; e. g. on a simple GET request.
2. **Response**. Data sent by the service to the frontend. Optional if no data is required by the frontend after a request; e. g. on a simple POST request.
3. **Errors**. HTTP error codes the service sets provided an error ocurred. The format for this section is a table; where the first column indicates the HTTP status code, and the second column describes the cases in which this status is set.

## Services required on each view

| View |Service |
|---|---|
| Login | [GET_user_BY_credentials](#get_user_by_credentials) |
| Groups Catalog | [GET_groups_GB_major](#get_groups_gb_major)<br>[GET_classes_BY_group_id](#get_classes_by_group_id)<br>[POST_approve_group](#post_approve_group) |
| Groups Edit | [GET_courses_BY_group_id](#get_courses_by_group_id)<br>[GET_classes_BY_group_id](#get_classes_by_group_id)<br>[GET_classrooms](#get_classrooms)<br>[POST_class](#post_class)<br>[POST_approve_group](#post_approve_group) |

## Services

### GET_user_BY_credentials

#### Request

```json
{
  "username": "('A' | 'P' | 'S')<user_code>",
  "password": "<password>"
}
```

#### Response

```json
{
  "type": "('A' | 'P' | 'S')",
}
```

#### Error HTTP code

401 Unauthorized

### GET_groups_GB_major

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

### GET_classes_BY_group_id

#### Request

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

### GET_courses_BY_group_id

#### Request

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

### GET_classrooms

#### Response

```json
["<classroom_name>"]
```

### POST_class

#### Request

```json
{
    "start_hour": "<24-format>",
    "end_hour": "<24-format>",
    "classroom_name": "<classroom>",
    "course_id": "<INTEGER>",
    "weekday": "('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')"
}
```

#### Error HTTP code

409 Conflict

### POST_approve_group

#### Request

```json
{
    "group_id": "<INTEGER>",
    "approved": "(0 | 1)"
}
```
