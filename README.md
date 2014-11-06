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
  "owners": ["545287ba4c208ee46961de5b"],
  "images": ["5452888d4c208ee46961de5d", "5452888d4c208ee469614990"],
  "updated_at": "2014-10-26T16:32:34.231Z",
  "created_at": "2014-10-26T15:48:23.411Z",
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

#### PUT /locations/:id

###### Request
`Authorization` `required`
```
{
  "title": "New title",
  "description:" "New description"
}
```
###### Response
```
{
  "message": "Updated"
}
```

#### DELETE /locations/:id

###### Request
`Authorization` `required`

###### Response
```
{
  "message": "Deleted"
}
```

## Collections

#### GET /collections/:id

###### Request
`Authorization` `not required`

###### Response
```
{
  "title": "Title",
  "description": "Some description",
  "locations": ["541c01be87d6ac301ef72447", "541c01be87d6ac301ef65381"]
  "owners": ["545287ba4c208ee46961de5b"],
  "updated_at": "2014-10-26T16:32:34.231Z",
  "created_at": "2014-10-26T15:48:23.411Z",
}
```

#### POST /collections

###### Request
`Authorization` `required`
```
{
  "title": "Title",
  "description": "Some description",
  "locations": ["541c01be87d6ac301ef65381"]
}
```

###### Response
```
{
  "id": "541c01be87d6ac301ef72447"
}
```

## Users

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


## Images

#### GET /images/:id

###### Request
`Content-Type` `image/jpeg`

###### Response
`Content-Type` `image/jpeg`

#### POST /images

###### Request
`Authorization` `required`

form-data fields
`image` `imageData: .jpg or .jpeg or .png`
`location` `54528b9d55b8f08046fd9773`

###### Response
```
{
  "id": "545b644bbf2589483c87c20c"
}
```
