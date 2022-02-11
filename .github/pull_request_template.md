## Summary

Description of PR here...
Closes #85, Closes #22

## Changes

- Item 1
- Item 2
- Item 3

## Screenshots

(Insert image, only for frontend)

## Requests / Responses

**Request**
(Only for backend)
POST `/api/users` Returns a list of users

```
{
  "data": {
    "attributes": {
      "name": "The Dude",
      "email": "thedudeabides@wee.net",
      "password": "hellopassword"
    }
  },
  "type": "users"
}
```

**Response**
(Only for backend)
HTTP/1.1 200 OK

```
{
  "data": {
    "type": "users",
    "id": "4",
    "attributes": {
      "name": "The Dude",
      "email": "thedudeabides@wee.net",
      "last-logged-in": null,
      "created-at": "2016-10-20T17:45:08.190Z",
      "updated-at": "2016-10-20T17:45:08.190Z"
    },
    "links": {
      "self": "/users/4"
    }
  }
}
```
