const express = require('express');
const userModel = require('./userModel');
const router = express.Router();
const authRequired = require('../middleware/authRequired');
const companyIdCheck = require('../middleware/companyIdCheck');
const userIdCheck = require('../middleware/userIdCheck');

/**
 * @swagger
 * /company/{companyId}:
 *  get:
 *    description: Returns a Company object
 *    summary: Returns a Company object
 *    security:
 *      - okta: []
 *    tags:
 *      - company
 *    parameters:
 *      - $ref: '#/components/parameters/companyId'
 *    responses:
 *      200:
 *        description: company object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/company'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 */
router.get('/:company_id', function (req, res) {
  userModel
    .getCompany(req.params.company_id)
    .then((company) => {
      res.status(200).json(company);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Company not found' }, err);
    });
});

/**
 * @swagger
 * /company/{companyId}/users:
 *  get:
 *    description: Returns a list of the users in a company
 *    summary: Returns a list of the users in a company
 *    security:
 *      - okta: []
 *    tags:
 *      - company
 *      - user
 *    parameters:
 *      - $ref: '#/components/parameters/companyId'
 *    responses:
 *      200:
 *        description: array of users
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/user'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: 'Something went wrong'
 *  post:
 *    description: add a user
 *    summary: add a user
 *    security:
 *      - okta: []
 *    tags:
 *      - user
 *    requestBody:
 *      description: user object to to be added (minus id, foreign keys represented by integers or uuid)
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/user'
 *    parameters:
 *      - $ref: '#/components/parameters/companyId'
 *    responses:
 *      200:
 *        description: the new user object
 *        content:
 *          application/json:
 *             $ref: '#/components/schemas/user'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        $ref: '#/components/responses/NotFound'
 */
router.get(
  '/:company_id/users?',
  authRequired,
  companyIdCheck,
  function (req, res) {
    userModel
      .getCompanyUsers(req.params.company_id)
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong', err });
      });
  }
);

router.post('/:company_id/users?', companyIdCheck, function (req, res) {
  const createUser = req.body;
  userModel
    .createUser(createUser)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Something went wrong', err });
    });
});

/**
 * @swagger
 * /company/{companyId}/user/{userId}:
 *  get:
 *    description: Returns a user object
 *    summary: Returns a user object
 *    security:
 *      - okta: []
 *    tags:
 *      - user
 *    parameters:
 *      - $ref: '#/components/parameters/companyId'
 *      - $ref: '#/components/parameters/userId'
 *    responses:
 *      200:
 *        description: array of users
 *        content:
 *          application/json:
 *             $ref: '#/components/schemas/user'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        $ref: '#/components/responses/NotFound'
 *  put:
 *    description: update a user
 *    summary: update a user
 *    security:
 *      - okta: []
 *    tags:
 *      - user
 *    requestBody:
 *      description: user object to to be updated or a portion
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/user'
 *    parameters:
 *      - $ref: '#/components/parameters/companyId'
 *      - $ref: '#/components/parameters/userId'
 *    responses:
 *      200:
 *        description: the updated user object
 *        content:
 *          application/json:
 *             $ref: '#/components/schemas/user'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: 'Unable to update'
 *  delete:
 *    summary: Remove a user
 *    security:
 *      - okta: []
 *    tags:
 *      - user
 *    parameters:
 *      - $ref: '#/components/parameters/companyId'
 *      - $ref: '#/components/parameters/userId'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: A message about the result
 */
router
  .route(['/users?/:user_id', '/:company_id/users?/:user_id'])
  .all(userIdCheck)
  .get(function (req, res) {
    userModel
      .getCompanyUser(req.params.user_id)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'user not found', err });
      });
  })
  .put(function (req, res) {
    const updates = req.body;
    console.log(updates);
    userModel
      .updateProfile(updates, req.params.user_id)
      .then((user) => {
        res.status(200).json({ message: req.body, user });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'Unable to update', err });
      });
  })
  .delete(function (req, res) {
    userModel
      .deleteUser(req.params.user_id)
      .then(() => {
        res.status(200).json({ message: 'Deleted' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong', err });
      });
  });

/**
 * @swagger
 * /company/user/{code}:
 *  post:
 *    description: create a new user and add them to the role by code
 *    summary: create a new user and add them to the role by code
 *    security:
 *      - okta: []
 *    tags:
 *      - user
 *    parameters:
 *      - $ref: '#/components/parameters/code'
 *    requestBody:
 *      description: user object to to be added
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/user'
 *    responses:
 *      200:
 *        description: the new user object
 *        content:
 *          application/json:
 *             $ref: '#/components/schemas/user'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: 'Unable to add user'
 */

router.post('/user/:code', function (req, res) {
  userModel
    .createUserWithCode(req.body, req.params.code)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Something went wrong', err });
    });
});

/**
 * @swagger
 * /company/new:
 *  post:
 *    description: create a company and add a user
 *    summary: create a company and add a user
 *    security:
 *      - okta: []
 *    tags:
 *      - users
 *      - company
 *    requestBody:
 *      description: user object to to be added (minus id, foreign keys represented by integers or uuid)
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/user'
 *    responses:
 *      200:
 *        description: the new user object
 *        content:
 *          application/json:
 *             $ref: '#/components/schemas/user'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        $ref: '#/components/responses/NotFound'
 */
router.post('/new', function (req, res) {
  const createUser = req.body.user;
  const createCompany = req.body.company;
  userModel
    .createUserNewCompany(createUser, createCompany)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Something went wrong', err });
    });
});

/**
 * @swagger
 * /company/user/{userId}:
 *  post:
 *    description: create a new company and add a new user as admin
 *    summary: create a new company and add a new user as admin
 *    security:
 *      - okta: []
 *    tags:
 *      - user
 *      - company
 *    requestBody:
 *      description: user and company objects to to be added
 *      content:
 *        application/json:
 *          schema:
 *            - $ref: '#/components/schemas/user'
 *            - $ref: '#/components/schemas/company'
 *    responses:
 *      200:
 *        description: the new user object
 *        content:
 *          application/json:
 *             $ref: '#/components/schemas/user'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: 'Unable to add user'
 */

router.put('/user/:user_id/:code', userIdCheck, function (req, res) {
  userModel
    .assignUser(req.params.user_id, req.params.code)
    .then((user) => {
      res.status(200).json({ message: 'User added.', user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Unable to update', err });
    });
});

/**
 * @swagger
 * /company/user/{userId}/{code}:
 *  put:
 *    description: add a user to the role by code
 *    summary: add a user to the role by code
 *    security:
 *      - okta: []
 *    tags:
 *      - user
 *    parameters:
 *      - $ref: '#/components/parameters/userId'
 *      - $ref: '#/components/parameters/code'
 *    responses:
 *      200:
 *        description: the new user object
 *        content:
 *          application/json:
 *             $ref: '#/components/schemas/user'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: 'Unable to add user'
 */

module.exports = router;
