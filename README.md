locmap-api documentation
======

All requests should use header:
`Content-Type` `application/json`


To use authentication in request use header:
`Authorization` `Bearer tokenKeyFromAuthLogin`

## Locations

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
  "longitude": 132,
  "updated_at": "2014-10-26T15:48:23.411Z"
}
```

#### POST /locations

###### Request
`Authorization` `required`
```
{
  "title": "Test",
  "description": "Test description",
  "latitude": 23.1,
  "longitude": 62
}
```

###### Response
```
{
  "id": "541c01be87d6ac301ef72447"
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

### Collections

#### GET /collections/:id

Returns route object specified by ObjectID

```
{
  "title": "Title",
  "description": "Some description",
  "locations": ["541c01be87d6ac301ef72447", "541c01be87d6ac301ef65381"]
}
```


#### POST /collections

Creates route object

```
{
  "title": "Title",
  "description": "Some description",
  "locations": ["541c01be87d6ac301ef65381"]
}
```

### Users

#### GET /users/:id

Returns user's username specified by ObjectID

```
{
  "username": "test"
}
```


#### DELETE /users/:id

Deletes user object specified by ObjectID

### Authentication

#### POST /auth/login

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
