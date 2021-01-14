const express = require('express');
const authRequired = require('../middleware/authRequired');
const Companies = require('./companyModel');
const router = express.Router();

/**
 * @swagger
 * /companies:
 *  get:
 *    description: Returns a list of all companies
 *    summary: Get a list of all companies
 *    security:
 *      - okta: []
 *    tags:
 *      - company
 *    responses:
 *      200:
 *        description: array of companies
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/company'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', authRequired, function (req, res) {
  Companies.findAll()
    .then((companies) => {
      res.status(200).json(companies);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

/**
 * @swagger
 * /companies/{companyId}:
 *  get:
 *    description: Returns the specified company object
 *    summary: Get a specified company object
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
router.get('/:id', authRequired, function (req, res) {
  const id = String(req.params.id);
  Companies.findById(id)
    .then((company) => {
      if (company) {
        res.status(200).json(company);
      } else {
        res.status(404).json({ error: 'CompanyNotFound' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * @swagger
 * /companies:
 *  post:
 *    summary: Add a company
 *    security:
 *      - okta: []
 *    tags:
 *      - company
 *    requestBody:
 *      description: company object to to be added (minus id)
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/company'
 *    responses:
 *      400:
 *        $ref: '#/components/responses/BadRequest'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: The new company object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: company created
 *                company:
 *                  $ref: '#/components/schemas/company'
 */
router.post('/', authRequired, async (req, res) => {
  const company = req.body;
  if (company) {
    const id = company.id || 0;
    try {
      await Companies.findById(id).then(async (pf) => {
        if (pf == undefined) {
          //company not found so lets insert it
          await Companies.create(company).then((company) =>
            res
              .status(200)
              .json({ message: 'company created', company: company[0] })
          );
        } else {
          res.status(400).json({ message: 'company already exists' });
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(404).json({ message: 'Company missing' });
  }
});

/**
 * @swagger
 * /companies/{companyId}:
 *  put:
 *    summary: Update a company
 *    security:
 *      - okta: []
 *    tags:
 *      - company
 *    requestBody:
 *      description: company object to to be updated or portion
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/company'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: A company object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: company updated
 *                company:
 *                  $ref: '#/components/schemas/company'
 */
router.put('/', authRequired, function (req, res) {
  const company = req.body;
  if (company) {
    const id = company.id || 0;
    Companies.findById(id)
      .then(
        Companies.update(id, company)
          .then((updated) => {
            res
              .status(200)
              .json({ message: 'company updated', company: updated[0] });
          })
          .catch((err) => {
            res.status(500).json({
              message: `Could not update company '${id}'`,
              error: err.message,
            });
          })
      )
      .catch((err) => {
        res.status(404).json({
          message: `Could not find company '${id}'`,
          error: err.message,
        });
      });
  }
});

/**
 * @swagger
 * /companies/{companyId}:
 *  delete:
 *    summary: Remove a company
 *    security:
 *      - okta: []
 *    tags:
 *      - company
 *    parameters:
 *      - $ref: '#/components/parameters/companyId'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: A company object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: company 3 was deleted.
 *                company:
 *                  $ref: '#/components/schemas/company'
 */
router.delete('/:id', authRequired, function (req, res) {
  const id = req.params.id;
  try {
    Companies.findById(id).then((company) => {
      Companies.remove(company.id).then(() => {
        res
          .status(200)
          .json({ message: `Company '${id}' was deleted.`, company: company });
      });
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not delete company with ID: ${id}`,
      error: err.message,
    });
  }
});

module.exports = router;
