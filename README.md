# xcel-wom

For steps on how to work with this repository [please see here](https://docs.labs.lambdaschool.com/labs-spa-starter/)

# Project

You can find the deployed API at [https://xcel-wom-api-b.herokuapp.com]

## Contributors

|[Jose Sustaita](https://github.com/JoseSustaita) |[ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/josesustaita/)| <br> [<img src="https://avatars3.githubusercontent.com/u/8072587?s=400&u=2d285e09f8394ea773338042a6530393b72c468a&v=4" width = "200" />](https://github.com/JoseSustaita)<br>
:---------------------------:<br><br>
[Matthew Taylor](https://github.com/MTaylor-tech) |[ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/taylorjadepalmer/)| <br> [<img src="https://avatars1.githubusercontent.com/u/3969757?s=460&u=dff67932da9702cf48b0868eb3ca7ea6a0563ca0&v=4" width = "200" />](https://github.com/MTaylor-tech)<br>
:---------------------------:<br><br>
[Idong Essien](https://github.com/idongessien) |[ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/idongessien/)| <br> [<img src="https://avatars1.githubusercontent.com/u/22062405?s=460&u=f8f768b5e18a50bfac5e94932028fcef08b0e5f3&v=4" width = "200" />](https://github.com/idongessien) <br>
:---------------------------:<br><br>
[Devin Ong](https://github.com/hoangvu71) |[ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/)| <br> [<img src="https://www.dalesjewelers.com/wp-content/uploads/2018/10/placeholder-silhouette-male.png" width = "200" />](https://github.com/hoangvu71) <br>
:---------------------------:<br><br>
[Jonathan Chiaverini](https://github.com/JC8747) |[ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/jonathanchiaverini/)|<br> [<img src="https://avatars1.githubusercontent.com/u/55720706?s=460&u=bf12482f2a0eac9f2c5dcebac048d568027aa057&v=4" width = "200" />](https://github.com/JC8747) <br>
:---------------------------:

<br>
<br>

![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg)
![node express](https://img.shields.io/node/v-lts/express)
![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)

### Key Features

- feature one
- feature two
- feature three
- feature four
- feature five

#### Back end deployed to `Heroku`

#### [Front end](https://github.com/Lambda-School-Labs/xcel-wom-fe-b) built using: ![React](https://img.shields.io/badge/react-v16.7.0--alpha.2-blue.svg)

#### Back End built using:

- node.js
- express
- knex
- postgres

# API Endpoints

### Work Order Router:

`/company/{companyId}/order` or `/company/{companyId}/orders`

- `/company/{companyId}/orders`
  - GET: returns array of WOs for company (404 if none)
  - POST: add a new WO (returns msg & new WO)
- `/company/{companyId}/order/{orderId}`
  - GET: returns the specified WO
  - PUT: update the specified WO (returns msg & updated WO)
  - DELETE: remove the specified WO (returns msg & deleted WO)
- `/company/{companyId}/order/{orderId}/comments` (needs docs)
  - GET: returns array of comments for WO, empty array if none
  - POST: add comment (returns msg & new comment)
- `/company/{companyId}/order/{orderId}/comment/{commentId}` (nd)
  - PUT: update the comment (returns msg & updated comment)
  - DELETE: remove the comment (returns msg & deleted comment)
- `/company/{companyId}/order/{orderId}/images` (nd)
  - GET: returns array of images for WO, empty array if none
  - POST: add image (returns msg & new image)
- `/company/{companyId}/order/{orderId}/image/{imageId}` (nd)
  - DELETE: remove the image (returns msg & deleted image)

### User Router:

`/company`

- `/company/{companyId}`
  - GET: returns the company
- `/company/{companyId}/users`
  - GET: return array of users in company
- `/company/{companyId}/user/{userId}`
  - GET: return specified user
  - DELETE: remove specified user (returns msg)
- `/company/{companyId}/user` (pl)
  - POST: add a user (returns new user)
- `/company/user/{userId}` (agg)
- PUT: update the user (returns msg & updated user)
- Still awaiting review & merge:
- `/company/user/{code}`
  - POST: creates a new user, putting them into the company and role specified by the code
- `/company/new`
  - POST: expects `req.body` to contain both a user object and a company object. Creates the company, creates the user, adding the user as the 'Admin' of the new company. (I didn't know what path to put this on, so it can be changed if the team thinks of a better endpoint. Aside: we should review all the endpoints after the functionality is finalized and make sure they are useful labels.)
- `/company/user/{userId}/{code}`
  - PUT: adds the user with the specified userId to the company and role associated with the code.

### Company Router:

`/companies`

- `/companies`
  - GET: returns array of all companies
  - POST: add a company, set up roles & codes (returns msg & new company) (mk sr rtns r+c)
  - PUT: update company (returns msg & updated company) (nfx)
- `/companies/{companyId}`
  - GET: returns the specified company
  - PUT: update specified company (returns msg & updated company)
  - DELETE: remove the company (returns msg & deleted company)
- Still awaiting review & merge:
  - `/companies/{companyId}/roles`
    - GET: returns an array of the company's roles, including registration codes
  - `/companies/roles/{code}`
    - GET: returns the role associated with the code

### Property Router:

`/property` or `/properties`

- `/properties`
  - GET: returns array of all properties
  - POST: add a property (returns msg & new property)
  - PUT: update a property (returns msg & updated property) (nfx)
- `/property/{propertyId}`
  - GET: returns the specified property (404 if not found)
  - DELETE: remove the property (returns msg & deleted property)

## Getting Started

### Environment Variables

- `PORT` - API port (optional, but helpful with FE running as well)
  - The following ports are whitelisted for use with okta
    - 3000
    - 8000
    - 8080
- `DATABASE_URL` - connection string for postgres database
- `OKTA_URL_ISSUER` - The complete issuer URL for verifying okta access tokens. `https://example.okta.com/oauth2/default`
- `OKTA_CLIENT_ID` - the okta client ID.

See `.env.sample` file for example values

### Setup postgres

There are 3 options to get postgresql installed locally [Choose one]:

1. Use docker. [Install](https://docs.docker.com/get-docker/) for your platform
   - run: `docker-compose up -d` to start up the postgresql database and pgadmin.
   - Open a browser to [pgadmin](http://localhost:5050/) and you should see the Dev server already defined.
   - If you need to start over you will need to delete the folder `$ rm -rf ./data/pg` as this is where all of the server data is stored.
     - if the database `api-dev` was not created then start over.
2. Download and install postgresql directly from the [main site](https://www.postgresql.org/download/)
   - make note of the port, username and password you use to setup the database.
   - Connect your client to the server manually using the values previously mentioned
   - You will need to create a database manually using a client.
   - Make sure to update the DATABASE_URL connection string with the values for username/password, databasename and server port (if not 5432).
3. Setup a free account at [ElephantSQL](https://www.elephantsql.com/plans.html)
   - Sign up for a free `Tiney Turtle` plan
   - copy the URL to the DATABASE_URL .env variable
   - make sure to add `?ssl=true` to the end of this url

### Setup the application

- create your project repo by forking or using this as a template.
- run: `npm install` to download all dependencies.
- confirm correct env variables in your `.env` file.
- run: `npm run knex migrate:latest` to create the starting schema.
- run: `npm run knex seed:run` to populate your db with some data.
- run: `npm run tests` to confirm all is setup and tests pass.
- run: `npm run watch:dev` to start nodemon in local dev enviornment.

> Make sure to update the details of the app name, description and version in
> the `package.json` and `config/jsdoc.js` files.

# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./CODE_OF_CONDUCT.md). Please follow it in all your interactions with the project.

## Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

- Check first to see if your issue has already been reported.
- Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
- Create a live example of the problem.
- Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Documentation

See [Backend Documentation](https://xcel-wom-api-b.herokuapp.com/api-docs/) for details on the backend of our project.
