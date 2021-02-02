const express = require('express');
const authRequired = require('../middleware/authRequired');
const Properties = require('./propertyModel');
const router = express.Router();

/**
 * @swagger
 * /properties:
 *  get:
 *    description: Returns a list of all properties
 *    summary: Get a list of all properties
 *    security:
 *      - okta: []
 *    tags:
 *      - property
 *    responses:
 *      200:
 *        description: array of properties
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/property'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 *  post:
 *    summary: Add a property
 *    security:
 *      - okta: []
 *    tags:
 *      - property
 *    requestBody:
 *      description: property object to to be added (minus id)
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/property'
 *    responses:
 *      400:
 *        $ref: '#/components/responses/BadRequest'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: The new property object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: property created
 *                property:
 *                  $ref: '#/components/schemas/property'
 */
router
  .route('/')
  .all(authRequired)
  .get(function (req, res) {
    Properties.findAll()
      .then((properties) => {
        res.status(200).json(properties);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: err.message });
      });
  })
  .post(async function (req, res) {
    const property = req.body;
    if (property) {
      const id = property.id || 0;
      try {
        await Properties.findById(id).then(async (pf) => {
          if (pf == undefined) {
            //property not found so lets insert it
            await Properties.create(property).then((property) =>
              res
                .status(200)
                .json({ message: 'property created', property: property[0] })
            );
          } else {
            res.status(400).json({ message: 'property already exists' });
          }
        });
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: e.message });
      }
    } else {
      res.status(404).json({ message: 'Property missing' });
    }
  });

/**
 * @swagger
 * /properties/{propertyId}:
 *  put:
 *    summary: Update a property
 *    security:
 *      - okta: []
 *    tags:
 *      - property
 *    requestBody:
 *      description: property object to to be updated or portion
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/property'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: A property object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: property updated
 *                company:
 *                  $ref: '#/components/schemas/property'
 *  get:
 *    description: Returns the specified property object
 *    summary: Get a specified property object
 *    security:
 *      - okta: []
 *    tags:
 *      - property
 *    parameters:
 *      - $ref: '#/components/parameters/propertyId'
 *    responses:
 *      200:
 *        description: property object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/property'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *  delete:
 *    summary: Remove a property
 *    security:
 *      - okta: []
 *    tags:
 *      - property
 *    parameters:
 *      - $ref: '#/components/parameters/propertyId'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: A property object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: property 3 was deleted.
 *                property:
 *                  $ref: '#/components/schemas/property'
 */
router.put(['/', '/:id'], authRequired, function (req, res) {
  const property = req.body;
  if (property) {
    let id = 0;
    if (req.params.id) {
      id = req.params.id;
    } else if (property.id) {
      id = property.id;
    }
    Properties.findById(id)
      .then(
        Properties.update(id, property)
          .then((updated) => {
            res
              .status(200)
              .json({ message: 'property updated', property: updated[0] });
          })
          .catch((err) => {
            res.status(500).json({
              message: `Could not update property '${id}'`,
              error: err.message,
            });
          })
      )
      .catch((err) => {
        res.status(404).json({
          message: `Could not find property '${id}'`,
          error: err.message,
        });
      });
  }
});

router
  .route('/:id')
  .all(authRequired)
  .get(function (req, res) {
    const id = String(req.params.id);
    Properties.findById(id)
      .then((property) => {
        if (property) {
          res.status(200).json(property);
        } else {
          res.status(404).json({ error: 'PropertyNotFound' });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  })
  .delete(function (req, res) {
    const id = req.params.id;
    try {
      Properties.findById(id).then((property) => {
        Properties.remove(property.id).then(() => {
          res.status(200).json({
            message: `Property '${id}' was deleted.`,
            property: property,
          });
        });
      });
    } catch (err) {
      res.status(500).json({
        message: `Could not delete property with ID: ${id}`,
        error: err.message,
      });
    }
  });

module.exports = router;
