# Services API Documentation

## Table of contents

<!-- TOC -->

- [Services API Documentation](#services-api-documentation)
    - [Table of contents](#table-of-contents)
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

## Services required on each view

| View |Service |
|---|---|
| Login | [GET_user_BY_credentials](#getuserbycredentials) |
| Groups Catalog | [GET_groups_GB_major](#getgroupsgbmajor)<br>[GET_classes_BY_group_id](#getclassesbygroup_id)<br>[POST_approve_group](#postapprove_group) |
| Groups Edit | [GET_courses_BY_group_id](#getcoursesbygroup_id)<br>[GET_classes_BY_group_id](#getclassesbygroup_id)<br>[POST_class](#postclass)<br>[POST_approve_group](#postapprove_group)<br>[GET_classrooms](#getclassrooms) |

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
