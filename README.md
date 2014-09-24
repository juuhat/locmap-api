locApi
======

## API

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

### Authentication

`post /auth/login`

If credentials match returns access token in `x-access-token` header

```
{
  email: "test@example.com",
  password: "pw123"
}
```

`post /auth/register`

Creates new user with given credentials

```
{
  email: "test@example.com",
  username: "test",
  password: "pw123"
}
