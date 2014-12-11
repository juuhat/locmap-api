locmap-api documentation
======

All requests should use header:
`Content-Type` `application/json`


To use authentication in request use header:
`Authorization` `Bearer tokenKeyFromAuthLogin`


Responses:
`created_at` and `updated_at` fields use ISO 8601 format and UTC Time Zone


## Locations

#### GET /locations
###### Request
`Authorization` `not required`

**Optional search parameters:**

Get locations within distance (km) of given coordinates

`/locations?lat=23.1323&lon=52.32414&dist=30`

###### Response
```
{
"locations:"
  [
    {
      "_id": "54528b9d55b8f08046fd9773",
      "title": "NewTitle",
      "description": "Some description",
      "latitude": 23.1,
      "longitude": 52,
      "created_at": "2014-11-05T22:00:45.343Z",
      "updated_at": "2014-11-05T22:00:45.343Z",
      "owners": ["545287ba4c208ee46961de5b"],
      "images": ["5452888d4c208ee46961de5d", "5452888d4c208ee469614990"],
    },
    {
      "_id": "54528b9d55b8f08046fd9773",
      "title": "Title",
      "description": "desc desc desc",
      "latitude": 33.14,
      "longitude": 44.132,
      "created_at": "2014-11-05T22:00:45.343Z",
      "updated_at": "2014-11-05T22:00:45.343Z",
      "owners": ["545287ba4c208ee46961de5b"],
      "images": ["5452888d4c208ee46961de5d", "5452888d4c208ee469614990"],
    }
  ]
}
```

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
  "_id": "541c01be87d6ac301ef72447",
  "title": "Test",
  "description": "Test description",
  "latitude": 23.1,
  "longitude": 62,
  "created_at": "2014-11-15T18:45:33.817Z",
  "updated_at": "2014-11-15T18:45:33.817Z",
  "owners": ["546799265a1eda2827b138bd"]
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
  "owners": ["545287ba4c208ee46961de5b"],
  "updated_at": "2014-10-26T16:32:34.231Z",
  "created_at": "2014-10-26T15:48:23.411Z",
  "locations": [
    {
      "_id": "54528b9d55b8f08046fd9773",
      "title": "NewTitle",
      "description": "Some description",
      "latitude": 23.1,
      "longitude": 52,
      "created_at": "2014-11-05T22:00:45.343Z",
      "updated_at": "2014-11-05T22:00:45.343Z",
      "owners": ["545287ba4c208ee46961de5b"],
      "images": ["5452888d4c208ee46961de5d", "5452888d4c208ee469614990"],
    },
    {
      "_id": "54528b9d55b8f08046fd9773",
      "title": "Title",
      "description": "desc desc desc",
      "latitude": 33.14,
      "longitude": 44.132,
      "created_at": "2014-11-05T22:00:45.343Z",
      "updated_at": "2014-11-05T22:00:45.343Z",
      "owners": ["545287ba4c208ee46961de5b"],
      "images": ["5452888d4c208ee46961de5d", "5452888d4c208ee469614990"],
    }
  ]
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

###### Request
`Authorization` `not required`

###### Response
```
{
  "_id": "546799535a1eda2827b138bf",
  "username": "gg",
  "created_at": "2014-11-15T18:20:03.560Z",
  "locations": ["54528b9d55b8f08046fd9773", "54528c4ae1cd650c7b597efc"],
  "collections": []
}
```

### Authentication

#### POST /auth/login
If credentials match returns access token in `x-access-token` header

###### Request
```
{
  "email": "test@example.com",
  "password": "pw123"
}
```

###### Response
`x-access-token` `your-access-token`
```
{
  "_id": "5467a624874603b123bf07be",
  "username": "test",
  "email": "test@example.com",
  "created_at": "2014-11-15T19:14:44.592Z",
  "updated_at": "014-11-16T11:52:55.174Z"
}
```


#### POST /auth/register
Creates new user with given credentials

###### Request
```
{
  "email": "test@example.com",
  "username": "test",
  "password": "pw123"
}
```

###### Response
```
{
  "_id": "5468908f02b1e88925eb688c",
  "username": "test",
  "email": "test@example.com",
  "created_at": "014-11-16T11:54:55.979Z",
  "updated_at": "014-11-16T11:54:55.979Z"
}
```


#### POST /auth/logout
Log out the user matching to given auth token

###### Request
`Authorization` `required`

###### Response
```
{
  "message": "Logged out"
}
```


## Images

#### GET /images/:id

###### Request
`Content-Type` `image/jpeg`

###### Response
`Content-Type` `image/jpeg`

#### GET /images

###### Request
`Authentication` `admin`

###### Response
```
{
  "images":
  [
    {
      "_id": "545b7436106958212eaeabe0",
      "created_at": "2014-11-06T13:14:30.835Z",
      "location": "545b73fe106958212eaeabdf",
      "owner": "545b738a106958212eaeabde"
      },
      {
      "_id": "546a3d8902b1e88925eb6890",
      "created_at": "2014-11-17T18:25:13.011Z",
      "location": "546a3d6502b1e88925eb688f",
      "owner": "5468908f02b1e88925eb688c"
      }
  ]
}
```

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
