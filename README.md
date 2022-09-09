# ToVisitWebApp

## Description

RestAPI to view, create, edit and delete spots to visit, mostly meant for me as a fun way to store places I want to see in the Stockholm area, instead of keeping an excel file.
This repository also includes the frontend build.

The backend is a RestApi using node.js, the data is stored in MongoDB.

Can be accessed online [here](https://pacific-spire-62523.herokuapp.com/).

Front-end part, in ReactJs, can be viewed [here](https://github.com/elisakaisa/ToVisitWebApp_clientSide).

An android app, in Java, is also in the works [here](https://github.com/elisakaisa/To_visit_android_app).

## Installation

Requirements: `node: v16.17.0`and `npm: 8.12.2` (might work with previous versions too, not tested)

To use in development mode:

```bash
git clone
cd to_visit
npm install
npm run dev
```

Information stored in the `.env` file, to be added by the user:

```bash
MONGODB_URI = [mongodb address]
PORT = [integer]
SECRET = [any string]
```

## Endpoints

`GET [localhost address]/api/visits` returns all visits

`GET [localhost address]/api/visits/:id` returns visit with specific id

`GET [localhost address]/api/visits/timeLength/:timeLength` returns visits that have a specified timeLength, for instance day or weekend

`GET [localhost address]/api/visits/category/:category` returns visits of a certain category

`POST [localhost address]/api/visits` adds a new visit

`PATCH [localhost address]/api/visits/:id` replaces any fields of a visit with a given id, see `requests/update_visit.rest` for an example

`DELETE [localhost address]/api/visits/:id` deletes given visit

POST, PATCH and DELETE require an Authorization bearer, GET actions do not.

`POST [localhost address]/api/users` allows to create an user with a password and an username

`POST [localhost address]/api/login` allows to login the user

## Data Structure

visit is a an object with the following structure

```bash
{
    what: String,
    where: String,
    category: [String],
    how: [String],
    timeLength: String,
    timeOfYear: {
        spring: Boolean,
        summer: Boolean,
        fall: Boolean,
        winter: Boolean,
        indoors: Boolean,
    },
    priceCategory: String,
    easeOfOrganization: String,
    notes: String,
    done: Boolean,
    totalWalkingDistance: Number,
    actualPrice: Number
}
```

## Known issues

Currently none known.

Possible improvements:

- add filtering / query parameters
- add more GET endpoints
- improve tests

## Authors

Elisa Perini

## Credits

This project could not have been possible if it wasn't for the great mooc in fullstack web development, organized by the university of Helsinki. Link [here](https://fullstackopen.com/en/).