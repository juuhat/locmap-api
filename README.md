locmap-api documentation
======

All requests should use header:
`Content-Type` `application/json`


To use authentication in request use header:
`Authorization` `Bearer tokenKeyFromAuthLogin`

### Locations

#### GET /locations/:id

###### Request
`Authorization` `not required`

###### Response
```
{
  "_id": "541c01be87d6ac301ef72447",
  "title": "Test",
  "description": "Test description.",
  "latitude": 23.1,
  "longitude": 132
}
```


#### POST /locations

Creates new location object.

```
{
  "title": "Test",
  "description": "Test description",
  "latitude": 23.1,
  "longitude": 62
}
```


#### PUT /locations/:id`

Update location object specified by ObjectID

```
{
  "title": "New title",
  "description:" "New description"
}
```


#### DELETE /locations/:id

Deletes location object specified by ObjectID

### Route

#### GET /routes/:id

Returns route object specified by ObjectID

```
{
  "title": "Title",
  "description": "Some description",
  "locations": ["541c01be87d6ac301ef72447", "541c01be87d6ac301ef65381"]
}
```


#### post /routes

Creates route object

```
{
  "title": "Title",
  "description": "Some description",
  "locations": ["541c01be87d6ac301ef65381"]
}
```

### User

#### get /users/:id

Returns user's username specified by ObjectID

```
{
  "username": "test"
}
```


#### delete /users/:id

Deletes user object specified by ObjectID

### Authentication

#### post /auth/login

If credentials match returns access token in `x-access-token` header

```
{
  "email": "test@example.com",
  "password": "pw123"
}
```


#### POST /auth/register

Creates new user with given credentials

```
{
  "email": "test@example.com",
  "username": "test",
  "password": "pw123"
}
```


#### POST /auth/logout

Log out the user matching to given auth token


### Uploads

#### POST /uploads

`Content-Type` `multipart/form-data`
