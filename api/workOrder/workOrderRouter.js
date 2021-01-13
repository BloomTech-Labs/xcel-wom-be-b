const express = require('express');
const authRequired = require('../middleware/authRequired');
const WorkOrders = require('./workOrderModel');
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    WorkOrder:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: autoincrements
 *        title:
 *          type: string
 *        description:
 *          type: string
 *          description: an explanation of what needs done
 *        created_at:
 *          type: timestamp
 *        updated_at:
 *          type: timestamp
 *        company:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *              description: autoincrements
 *            name:
 *              type: string
 *        property:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *              description: autoincrements
 *            name:
 *              type: string
 *            address:
 *              type: string
 *              description: The physical address of the property
 *            imageUrl:
 *              type: string
 *              description: The public URL of an image of the property
 *            company:
 *              type: integer
 *              description:
 *                This is a foreign key to Companies.id. It should
 *                point to the same company referenced above.
 *        images:
 *          type: array
 *          items:
 *             type: object
 *             properties:
 *                id:
 *                  type: integer
 *                  description: autoincrements
 *                url:
 *                  type: string
 *                  description: The public URL of the image
 *                user:
 *                  type: string
 *                  description: The userId of the user who uploaded the image
 *                workOrder:
 *                  type: integer
 *                  description: A reference to this workOrder
 *        comments:
 *          type: array
 *          items:
 *             type: object
 *             properties:
 *                id:
 *                  type: integer
 *                  description: autoincrements
 *                comment:
 *                  type: string
 *                  description: The body of the comment
 *                user:
 *                  type: string
 *                  description: The userId of the user who wrote the comment
 *                workOrder:
 *                  type: integer
 *                  description: A reference to this workOrder
 *        createdBy:
 *          type: string
 *          description: This is a foreign key to Profiles.id (Okta Id)
 *        assignedTo:
 *          type: string
 *          description:
 *            This is a foreign key to Profiles.id (Okta Id). By default it is
 *            set to the same user as 'createdBy'
 *        priority:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *              description: autoincrements
 *            name:
 *              type: string
 *            color:
 *              type: string
 *              description: This is a hex code in the form '#RRGGBB'
 *        status:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *              description: autoincrements
 *            name:
 *              type: string
 *      example:
 *        id: 1
 *        title: 'Broken Radiator Thermostat'
 *        description:
 *          'Radiator Thermo in Apt 224 is broken. Probably needs replaced.'
 *        company:
 *            id: 1
 *            name: 'ACME Property Management'
 *        property:
 *            id: 1
 *            name: 'Lot 24'
 *            address: '2404 Railroad St, Pittsburgh, PA 15222'
 *            imageUrl: 'https://bit.ly/3ajfoTV'
 *            company: 1
 *        images:
 *            - id: 1
 *              url: 'http://path/to/image'
 *              user: '00ulthapbErVUwVJy4x6'
 *              workOrder: 1
 *            - id: 2
 *              url: 'http://path/to/image'
 *              user: '00ulthapbErVUwVJy4x6'
 *              workOrder: 1
 *        createdBy: '00ulthapbErVUwVJy4x6'
 *        assignedTo: '00ulthapbErVUwVJy4x6'
 *        priority:
 *            id: 2
 *            name: 'High'
 *            color: '#F7931B'
 *        status:
 *            id: 1
 *            name: 'Unassigned'
 *        created_at: '2020-12-15T22:46:05.962Z'
 *        updated_at: '2020-12-15T22:46:05.962Z'
 *
 * /workOrders:
 *  get:
 *    description: Returns a list of workOrders associated with the user
 *    summary: Get a list of workOrders created by or assigned to the user
 *    security:
 *      - okta: []
 *    tags:
 *      - workOrder
 *    responses:
 *      200:
 *        description: array of workOrders
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/WorkOrder'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  [
    '/',
    '/users?/workOrders?',
    '/users?/orders?',
    '/users?/:id/workOrders?',
    '/users?/:id/orders?',
    '/company/users?/:id/workOrders?',
    '/company/users?/:id/orders?',
    '/company/:companyId/users?/:id/workOrders?',
    '/company/:companyId/users?/:id/orders?',
  ],
  authRequired,
  function (req, res) {
    WorkOrders.findByUser(req.profile.id)
      .then((workOrders) => {
        res.status(200).json(workOrders);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: err.message });
      });
  }
);

/**
 * @swagger
 * components:
 *  parameters:
 *    workOrderId:
 *      name: id
 *      in: path
 *      description: ID of the workOrder to return
 *      required: true
 *      example: 1
 *      schema:
 *        type: integer
 *
 * /workOrder/{id}:
 *  get:
 *    description: Find a single workOrder by ID
 *    summary: Returns a single workOrder
 *    security:
 *      - okta: []
 *    tags:
 *      - workOrder
 *    parameters:
 *      - $ref: '#/components/parameters/workOrderId'
 *    responses:
 *      200:
 *        description: A workOrder object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/WorkOrder'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        description: 'WorkOrder not found'
 */
router.get(
  [
    '/:id',
    '/users?/workOrders?/:id',
    '/users?/orders?/:id',
    '/users?/:userId/workOrders?/:id',
    '/users?/:userId/orders?/:id',
    '/company/workOrders?/:id',
    '/company/orders?/:id',
    '/company/:companyId/workOrders?/:id',
    '/company/:companyId/orders?/:id',
    '/company/users?/:userId/workOrders?/:id',
    '/company/users?/:userId/orders?/:id',
    '/company/:companyId/users?/:userId/workOrders?/:id',
    '/company/:companyId/users?/:userId/orders?/:id',
    '/property/workOrders?/:id',
    '/property/orders?/:id',
    '/property/:propertyId/workOrders?/:id',
    '/property/:propertyId/orders?/:id',
    '/company/property/:propertyId/workOrders?/:id',
    '/company/property/:propertyId/orders?/:id',
    '/company/:companyId/property/:propertyId/workOrders?/:id',
    '/company/:companyId/property/:propertyId/orders?/:id',
  ],
  authRequired,
  function (req, res) {
    const id = String(req.params.id);
    WorkOrders.findById(id)
      .then((workOrder) => {
        if (workOrder) {
          res.status(200).json(workOrder);
        } else {
          res.status(404).json({ error: 'WorkOrderNotFound' });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  }
);

router.get(
  [
    '/company/:companyId',
    '/company/:companyId/workOrders?',
    '/company/:companyId/orders?',
  ],
  function (req, res) {
    const companyId = req.params.companyId;
    console.log(companyId);
    WorkOrders.findBy({ company: companyId })
      .then((workOrder) => {
        if (workOrder) {
          res.status(200).json(workOrder);
        } else {
          res.status(404).json({ error: 'WorkOrderNotFound' });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  }
);

router.get(
  [
    '/property/:propertyId',
    '/property/:propertyId/workOrders?',
    '/property/:propertyId/orders?',
    '/company/property/:propertyId',
    '/company/property/:propertyId/workOrders?',
    '/company/property/:propertyId/orders?',
    '/company/:companyId/property/:propertyId',
    '/company/:companyId/property/:propertyId/workOrders?',
    '/company/:companyId/property/:propertyId/orders?',
  ],
  function (req, res) {
    const propertyId = req.params.propertyId;
    console.log(propertyId);
    WorkOrders.findBy({ property: propertyId })
      .then((workOrder) => {
        if (workOrder.length > 0) {
          res.status(200).json(workOrder);
        } else {
          res.status(404).json({ error: 'WorkOrderNotFound' });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  }
);

/**
 * @swagger
 * /workOrder:
 *  post:
 *    summary: Add a workOrder
 *    security:
 *      - okta: []
 *    tags:
 *      - workOrder
 *    requestBody:
 *      description: WorkOrder object to to be added
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/WorkOrder'
 *    responses:
 *      400:
 *        $ref: '#/components/responses/BadRequest'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        description: 'WorkOrder not found'
 *      200:
 *        description: A workOrder object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: workOrder created
 *                workOrder:
 *                  $ref: '#/components/schemas/WorkOrder'
 */
router.post('/', authRequired, async (req, res) => {
  const workOrder = req.body;
  if (workOrder) {
    const id = workOrder.id || 0;
    try {
      await WorkOrders.findById(id).then(async (pf) => {
        if (pf == undefined) {
          //workOrder not found so lets insert it
          await WorkOrders.create(workOrder).then((workOrder) =>
            res
              .status(200)
              .json({ message: 'workOrder created', workOrder: workOrder[0] })
          );
        } else {
          res.status(400).json({ message: 'workOrder already exists' });
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(404).json({ message: 'WorkOrder missing' });
  }
});
/**
 * @swagger
 * /workOrder:
 *  put:
 *    summary: Update a workOrder
 *    security:
 *      - okta: []
 *    tags:
 *      - workOrder
 *    requestBody:
 *      description: WorkOrder object to to be updated
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/WorkOrder'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: A workOrder object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: workOrder created
 *                workOrder:
 *                  $ref: '#/components/schemas/WorkOrder'
 */
router.put(['/', '/:workOrderId'], authRequired, function (req, res) {
  const workOrder = req.body;
  if (workOrder) {
    const id = workOrder.id || 0;
    WorkOrders.findById(id)
      .then((found) => {
        if (found) {
          WorkOrders.update(id, workOrder)
            .then((updated) => {
              res
                .status(200)
                .json({ message: 'workOrder updated', workOrder: updated[0] });
            })
            .catch((err) => {
              res.status(500).json({
                message: `Could not update workOrder '${id}'`,
                error: err.message,
              });
            });
        } else {
          res.status(404).json({
            message: `Could not find workOrder '${id}'`,
            error: `not found`,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: `Error updating workOrder '${id}'`,
          error: err.message,
        });
      });
  }
});
/**
 * @swagger
 * /workOrder/{id}:
 *  delete:
 *    summary: Remove a workOrder
 *    security:
 *      - okta: []
 *    tags:
 *      - workOrder
 *    parameters:
 *      - $ref: '#/components/parameters/workOrderId'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: A workOrder object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: WorkOrder 3 was deleted.
 *                workOrder:
 *                  $ref: '#/components/schemas/WorkOrder'
 */
router.delete('/:id', authRequired, function (req, res) {
  const id = req.params.id;
  try {
    WorkOrders.findById(id).then((workOrder) => {
      WorkOrders.remove(workOrder.id).then(() => {
        res.status(200).json({
          message: `WorkOrder '${id}' was deleted.`,
          workOrder: workOrder,
        });
      });
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not delete workOrder with ID: ${id}`,
      error: err.message,
    });
  }
});

module.exports = router;
