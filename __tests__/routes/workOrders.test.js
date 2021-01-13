const request = require('supertest');
const express = require('express');
const WorkOrders = require('../../api/workOrder/workOrderModel');
const workOrderRouter = require('../../api/workOrder/workOrderRouter');
const server = express();
server.use(express.json());

const sample_workOrders = [
  {
    id: 1,
    title: 'Broken Radiator Thermostat',
    description:
      'Radiator Thermo in Apt 224 is broken. Probably needs replaced.',
    company: 1,
    property: 1,
    createdBy: '00ulthapbErVUwVJy4x6',
    assignedTo: '00ulthapbErVUwVJy4x6',
    priority: 2,
    status: 1,
    created_at: '2020-12-15T22:46:05.962Z',
    updated_at: '2020-12-15T22:46:05.962Z',
  },
  {
    id: 2,
    title: 'Loose Railing',
    description: 'Railing is coming away from floor in stairwell B.',
    company: 1,
    property: 1,
    createdBy: '00ulthapbErVUwVJy4x6',
    assignedTo: '00ulthapbErVUwVJy4x6',
    priority: 3,
    status: 1,
  },
  {
    title: 'Broken Railing',
    description: 'Railing is coming away from floor in stairwell B.',
    company: 1,
    property: 1,
    createdBy: '00ulthapbErVUwVJy4x6',
    assignedTo: '00ulthapbErVUwVJy4x6',
    priority: 3,
    status: 1,
  },
];

jest.mock('../../api/workOrder/workOrderModel');
// mock the auth middleware completely
jest.mock('../../api/middleware/authRequired', () =>
  jest.fn(function (req, res, next) {
    req.profile = { id: '00ulthapbErVUwVJy4x6' };
    return next();
  })
);

describe('workOrders router endpoints', () => {
  beforeAll(() => {
    // This is the module/route being tested
    server.use(['/workOrder', '/workOrders'], workOrderRouter);
    jest.clearAllMocks();
  });

  describe('GET /workOrders', () => {
    it('should return 200', async () => {
      WorkOrders.findByUser.mockResolvedValue(sample_workOrders);
      const res = await request(server).get('/workOrders');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(WorkOrders.findByUser.mock.calls.length).toBe(1);
    });
  });

  describe('GET /workOrder/:id', () => {
    it('should return 200 when workOrder found', async () => {
      WorkOrders.findById.mockResolvedValue({
        id: 1,
        title: 'Broken Radiator Thermostat',
        description:
          'Radiator Thermo in Apt 224 is broken. Probably needs replaced.',
        company: 1,
        property: 1,
        createdBy: '00ulthapbErVUwVJy4x6',
        assignedTo: '00ulthapbErVUwVJy4x6',
        priority: 2,
        status: 1,
        created_at: '2020-12-15T22:46:05.962Z',
        updated_at: '2020-12-15T22:46:05.962Z',
      });
      const res = await request(server).get('/workOrder/1');

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Broken Radiator Thermostat');
      expect(WorkOrders.findById.mock.calls.length).toBe(1);
    });

    it('should return 404 when not found', async () => {
      WorkOrders.findById.mockResolvedValue();
      const res = await request(server).get('/workOrder/0');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('WorkOrderNotFound');
    });
  });

  describe('POST /workOrder', () => {
    it('should return 200 when workOrder is created', async () => {
      const workOrder = {
        title: 'Broken Railing',
        description: 'Railing is coming away from floor in stairwell B.',
        company: 1,
        property: 1,
        createdBy: '00ulthapbErVUwVJy4x6',
        assignedTo: '00ulthapbErVUwVJy4x6',
        priority: 3,
        status: 1,
      };
      WorkOrders.findById.mockResolvedValue(undefined);
      WorkOrders.create.mockResolvedValue([
        Object.assign({ id: 2 }, workOrder),
      ]);
      const res = await request(server).post('/workOrder').send(workOrder);

      expect(res.status).toBe(200);
      expect(res.body.workOrder.id).toBe(2);
      expect(WorkOrders.create.mock.calls.length).toBe(1);
    });
  });

  describe('PUT /workOrder', () => {
    it('should return 200 when workOrder is updated', async () => {
      const workOrder = {
        id: 2,
        title: 'Loose Railing',
        description: 'Railing is coming away from floor in stairwell B.',
        company: 1,
        property: 1,
        createdBy: '00ulthapbErVUwVJy4x6',
        assignedTo: '00ulthapbErVUwVJy4x6',
        priority: 3,
        status: 1,
      };
      WorkOrders.findById.mockResolvedValue(workOrder);
      WorkOrders.update.mockResolvedValue([workOrder]);

      const res = await request(server).put('/workOrder/').send(workOrder);
      expect(res.status).toBe(200);
      expect(res.body.workOrder.title).toBe('Loose Railing');
      expect(WorkOrders.update.mock.calls.length).toBe(1);
    });
  });
});
