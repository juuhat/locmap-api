locApi
======

## API

All requests should use header:
`Content-Type` `application/json`


To use authentication in request use header:
`Authorization` `Bearer tokenKeyFromAuthLogin`

### Location

`get /location/:id`

Returns location object specified by objectID

```
{
  "_id": "541c01be87d6ac301ef72447",
  "title": "Test",
  "description": "Test description.",
  "latitude": 23.1,
  "longitude": 132
}
```


`post /location`

Creates new location object.

```
{
  "title": "Test",
  "description": "Test description",
  "latitude": 23.1,
  "longitude": 62
}
```


`put /location/:id`

Update location object specified by ObjectID

```
{
  "title": "New title",
  "description:" "New description"
}
```


`delete /location/:id`

Deletes location object specified by ObjectID

### Route

`get /routes/:id`

Returns route object specified by ObjectID

```
{
  "title": "Title",
  "description": "Some description",
  "locations": ["541c01be87d6ac301ef72447", "541c01be87d6ac301ef65381"]
}
```


`post /routes`

Creates route object

```
{
  "title": "Title",
  "description": "Some description",
  "locations": ["541c01be87d6ac301ef65381"]
}
```

### User

`get /users/:id`

Returns user's username specified by ObjectID

```
{
  "username": "test"
}
```


`delete /users/:id`

Deletes user object specified by ObjectID

### Authentication

`post /auth/login`

If credentials match returns access token in `x-access-token` header

```
{
  "email": "test@example.com",
  "password": "pw123"
}
```


`post /auth/register`

Creates new user with given credentials

```
{
  "email": "test@example.com",
  "username": "test",
  "password": "pw123"
}
```


`post /auth/logout`

Log out the user matching to given auth token


### Upload

`post /uploads`

`Content-Type` `multipart/form-data`
