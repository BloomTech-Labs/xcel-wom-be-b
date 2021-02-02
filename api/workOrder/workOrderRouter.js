const express = require('express');
const authRequired = require('../middleware/authRequired');
const WorkOrders = require('./workOrderModel');
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /company/{companyId}/orders:
 *  get:
 *    description: Returns a list of workOrders associated with the company
 *    summary: Get a list of workOrders associated with the company limited by user
 *    security:
 *      - okta: []
 *    tags:
 *      - workOrder
 *      - order
 *      - company
 *    responses:
 *      200:
 *        description: array of workOrders
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/workOrder'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 */
router.get('/', authRequired, function (req, res) {
  const companyId = req.params.companyId;
  if (companyId > 0) {
    WorkOrders.findByCompany(companyId)
      .then((workOrders) => {
        if (workOrders.length > 0) {
          res.status(200).json(workOrders);
        } else {
          res.status(404).json({ error: 'No Work Orders found' });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } else if (process.env.NODE_ENV === 'development') {
    // on the development server, `/company/0/orders` will give you all orders
    WorkOrders.findAll()
      .then((workOrders) => {
        if (workOrders.length > 0) {
          res.status(200).json(workOrders);
        } else {
          res.status(404).json({ error: 'No Work Orders found' });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  }
});

/**
 * @swagger
 * /company/{companyId}/orders/{workOrderId}:
 *  get:
 *    description: Find a single workOrder by ID
 *    summary: Returns a single workOrder
 *    security:
 *      - okta: []
 *    tags:
 *      - workOrder
 *      - order
 *    parameters:
 *      - $ref: '#/components/parameters/workOrderId'
 *    responses:
 *      200:
 *        description: A workOrder object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/workOrder'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 */
router.get('/:workOrderId', authRequired, function (req, res) {
  const id = String(req.params.workOrderId);
  WorkOrders.findById(id)
    .then((workOrder) => {
      if (workOrder) {
        res.status(200).json(workOrder);
      } else {
        res.status(404).json({ error: 'Work Order Not Found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * @swagger
 * /company/{companyId}/orders:
 *  post:
 *    summary: Add a workOrder
 *    security:
 *      - okta: []
 *    tags:
 *      - workOrder
 *    requestBody:
 *      description: WorkOrder object to to be added (minus id, foreign keys represented by integers or uuid)
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/workOrder'
 *    responses:
 *      400:
 *        $ref: '#/components/responses/BadRequest'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: The new workOrder object
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
 *                  $ref: '#/components/schemas/workOrder'
 */
router.post('/', authRequired, async (req, res) => {
  const workOrder = req.body;
  if (workOrder) {
    const id = workOrder.id || 0;
    try {
      await WorkOrders.findById(id).then(async (wo) => {
        if (wo == undefined) {
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
 * /company/{companyId}/orders/{workOrderId}:
 *  put:
 *    summary: Update a workOrder
 *    security:
 *      - okta: []
 *    tags:
 *      - workOrder
 *      - order
 *    requestBody:
 *      description: WorkOrder object to to be updated or portion
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/workOrder'
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
 *                  example: workOrder updated
 *                workOrder:
 *                  $ref: '#/components/schemas/workOrder'
 */
router.put(['/', '/:workOrderId'], authRequired, function (req, res) {
  const workOrder = req.body;
  let id = req.params.workOrderId;
  if (id === undefined) {
    id = workOrder.id;
  }
  if (workOrder !== undefined && id !== undefined) {
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
  } else {
    res.status(404).json({
      message: `Could not find workOrder '${id}'`,
      error: `not found`,
    });
  }
});

/**
 * @swagger
 * /company/{companyId}/orders/{workOrderId}:
 *  delete:
 *    summary: Remove a workOrder
 *    security:
 *      - okta: []
 *    tags:
 *      - workOrder
 *      - order
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
 *                  $ref: '#/components/schemas/workOrder'
 */
router.delete('/:workOrderId', authRequired, function (req, res) {
  const id = req.params.workOrderId;
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

router.get('/:id/comments?', authRequired, function (req, res) {
  const workOrderId = req.params.id;
  WorkOrders.getComments(workOrderId)
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.post('/:id/comments?', authRequired, function (req, res) {
  const comment = req.body;
  try {
    WorkOrders.addComment(comment).then((comment) =>
      res.status(200).json({ message: 'comment added', comment: comment[0] })
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

router.put('/:id/comments?/:commentId', authRequired, function (req, res) {
  const commentId = req.params.commentId;
  const comment = req.body;
  try {
    WorkOrders.updateComment(commentId, comment).then((updated) => {
      res.status(200).json({ message: 'comment updated', comment: updated[0] });
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not update comment '${commentId}'`,
      error: err.message,
    });
  }
});

router.delete('/:id/comments?/:commentId', authRequired, function (req, res) {
  const id = req.params.commentId;
  try {
    WorkOrders.removeComment(id).then((comment) => {
      res.status(200).json({
        message: `comment '${id}' was deleted.`,
        comment: comment,
      });
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not delete comment with ID: ${id}`,
      error: err.message,
    });
  }
});

router.get('/:id/images?', authRequired, function (req, res) {
  const workOrderId = req.params.id;
  WorkOrders.getImages(workOrderId)
    .then((images) => {
      res.status(200).json(images);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.post('/:id/images?', authRequired, function (req, res) {
  const image = req.body;
  try {
    WorkOrders.addImage(image).then((image) =>
      res.status(200).json({ message: 'image added', comment: image[0] })
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

router.delete('/:id/images?/:imageId', authRequired, function (req, res) {
  const id = req.params.imageId;
  try {
    WorkOrders.removeImage(id).then((image) => {
      res.status(200).json({
        message: `image '${id}' was deleted.`,
        image: image,
      });
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not delete image with ID: ${id}`,
      error: err.message,
    });
  }
});

module.exports = router;

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
 *    companyId:
 *      name: id
 *      in: path
 *      description: ID of the company to search for workOrders
 *      required: true
 *      example: 1
 *      schema:
 *        type: integer
 *    userId:
 *      name: id
 *      in: path
 *      description: ID of the user to return
 *      required: true
 *      example: 1
 *      schema:
 *        type: integer
 *    propertyId:
 *      name: id
 *      in: path
 *      description: ID of the user to return
 *      required: true
 *      example: 1
 *      schema:
 *        type: integer
 *  schemas:
 *    user:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: UUID from Okta
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        avatarUrl:
 *          type: string
 *          description: the public URL of the user's avatar image
 *        role:
 *          type: integer
 *          description: a reference to the 'roles' table
 *        company:
 *          type: integer
 *          description: a reference to the 'companies' table
 *      example:
 *        id: 'd376de0577681ca93614'
 *        name: 'Louie Smith'
 *        email: 'louie@example.com'
 *        avatarUrl:
 *           'https://s3.amazonaws.com/uifaces/faces/twitter/hermanobrother/128.jpg'
 *        role: 1
 *        company: 2
 *    company:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: autoincrements
 *        name:
 *          type: string
 *    property:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: autoincrements
 *        name:
 *          type: string
 *        address:
 *          type: string
 *          description: The physical address of the property
 *        imageUrl:
 *          type: string
 *          description: The public URL of an image of the property
 *        company:
 *          type: integer
 *          description: This is a foreign key to Companies.id.
 *      example:
 *        id: 1
 *        name: "Lot 24"
 *        address: "2404 Railroad St, Pittsburgh, PA 15222"
 *        imageUrl: "https://bit.ly/3ajfoTV"
 *        company: 1
 *    image:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: autoincrements
 *        url:
 *          type: string
 *          description: The public URL of the image
 *        user:
 *          type: string
 *          description: The userId of the user who uploaded the image
 *        workOrder:
 *          type: integer
 *          description: the id of the workOrder to which the image is attached
 *      example:
 *          id: 1
 *          url: 'http://path/to/image'
 *          user: '00ulthapbErVUwVJy4x6'
 *          workOrder: 1
 *      example2:
 *          id: 2
 *          url: 'http://path/to/image'
 *          user: '00ulthapbErVUwVJy4x6'
 *    images:
 *      type: array
 *      description: an array of image objects
 *      items:
 *        $ref: '#/components/schemas/image'
 *      example:
 *        [$ref: '#/components/schemas/image/example', $ref: '#/components/schemas/image/example2']
 *    comment:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: autoincrements
 *        comment:
 *          type: string
 *          description: The body of the comment
 *        user:
 *          type: string
 *          description: The userId of the user who wrote the comment
 *        workOrder:
 *          type: integer
 *          description: the id of the workOrder on which the comment is made
 *    comments:
 *      type: array
 *      description: an array of comment objects
 *      items:
 *        $ref: '#/components/schemas/comment'
 *    priority:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: autoincrements
 *        name:
 *          type: string
 *        color:
 *          type: string
 *          description: This is a hex code in the form '#RRGGBB'
 *      example:
 *        id: 2
 *        name: 'High'
 *        color: '#F7931B'
 *    status:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: autoincrements
 *        name:
 *          type: string
 *      example:
 *        id: 1
 *        name: 'Unassigned'
 *    workOrder:
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
 *          $ref: '#/components/schemas/company'
 *        property:
 *          $ref: '#/components/schemas/property'
 *        images:
 *          $ref: '#/components/schemas/images'
 *        comments:
 *          $ref: '#/components/schemas/comments'
 *        createdBy:
 *          type: string
 *          description: This is a foreign key to Profiles.id (Okta Id)
 *        assignedTo:
 *          type: string
 *          description:
 *            This is a foreign key to Profiles.id (Okta Id). By default it is
 *            set to the same user as 'createdBy'
 *        priority:
 *          $ref: '#/components/schemas/priority'
 *        status:
 *          $ref: '#/components/schemas/status'
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
 *          - id: 1
 *            url: 'http://path/to/image'
 *            user: '00ulthapbErVUwVJy4x6'
 *            workOrder: 1
 *          - id: 2
 *            url: 'http://path/to/image'
 *            user: '00ulthapbErVUwVJy4x6'
 *        createdBy: '00ulthapbErVUwVJy4x6'
 *        assignedTo: '00ulthapbErVUwVJy4x6'
 *        priority:
 *            $ref: '#/components/schemas/priority/example'
 *        status:
 *            $ref: '#/components/schemas/status/example'
 *        created_at: '2020-12-15T22:46:05.962Z'
 *        updated_at: '2020-12-15T22:46:05.962Z'
 */
