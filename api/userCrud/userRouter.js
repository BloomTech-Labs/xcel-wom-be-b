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
 *      - users
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
 */
router.get(
  '/:company_id/users',
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

/**
 * @swagger
 * /company/{companyId}/user/{userId}:
 *  get:
 *    description: Returns a user object
 *    summary: Returns a user object
 *    security:
 *      - okta: []
 *    tags:
 *      - users
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
 */
router.get('/:company_id/user/:user_id', function (req, res) {
  userModel
    .getCompanyUser(req.params.company_id, req.params.user_id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'user not found', err });
    });
});

/**
 * @swagger
 * /company/{companyId}/user:
 *  post:
 *    description: add a user
 *    summary: add a user
 *    security:
 *      - okta: []
 *    tags:
 *      - users
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
router.post('/:company_id/user', companyIdCheck, function (req, res) {
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
 * /company/user/{userId}:
 *  post:
 *    description: update a user
 *    summary: update a user
 *    security:
 *      - okta: []
 *    tags:
 *      - users
 *    requestBody:
 *      description: user object to to be updated or a portion
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/user'
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
 */
router.put('/user/:user_id', userIdCheck, function (req, res) {
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
});

/**
 * @swagger
 * /company/{companyId}/user/{userId}:
 *  delete:
 *    summary: Remove a user
 *    security:
 *      - okta: []
 *    tags:
 *      - user
 *    parameters:
 *      - $ref: '#/components/parameters/userId'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: A message about the result
 */
router.delete(
  '/:company_id/user/:user_id',
  companyIdCheck,
  userIdCheck,
  function (req, res) {
    userModel
      .deleteUser(req.params.user_id)
      .then(() => {
        res.status(200).json({ message: 'Deleted' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong', err });
      });
  }
);

module.exports = router;
