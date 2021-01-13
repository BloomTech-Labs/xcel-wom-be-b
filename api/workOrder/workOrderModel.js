const db = require('../../data/db-config');

const findAll = async () => {
  return await db('workOrders');
};

const findByUser = async (userId) => {
  return db('workOrders')
    .where(function () {
      this.where('createdBy', userId).orWhere('assignedTo', userId);
    })
    .join('profiles as u', 'workOrders.createdBy', 'u.id')
    .join('profiles as a', 'workOrders.assignedTo', 'a.id')
    .join('companies as c', 'workOrders.company', 'c.id')
    .join('properties as p', 'workOrders.property', 'p.id')
    .join('priority as pr', 'workOrders.priority', 'pr.id')
    .join('status as s', 'workOrders.status', 's.id')
    .select(
      'workOrders.id',
      'workOrders.title',
      'workOrders.description',
      'workOrders.created_at',
      'workOrders.updated_at',
      db.raw('row_to_json(s) as status'),
      db.raw('row_to_json(pr) as priority'),
      db.raw('row_to_json(c) as co'),
      db.raw('row_to_json(p) as property'),
      db.raw(
        'ARRAY(SELECT row_to_json(images) FROM images WHERE images."workOrder" = "workOrders".id) AS images'
      ),
      db.raw(
        'ARRAY(SELECT row_to_json(comments) FROM comments WHERE comments."workOrder" = "workOrders".id) AS comments'
      ),
      db.raw('row_to_json(u) as createdBy'),
      db.raw('row_to_json(a) as assignedTo')
    )
    .distinctOn('workOrders.id');
};

const findByCompany = async (companyId) => {
  return await db('workOrders')
    .where({ 'workOrders.company': companyId })
    .join('profiles as u', 'workOrders.createdBy', 'u.id')
    .join('profiles as a', 'workOrders.assignedTo', 'a.id')
    .join('companies as c', 'workOrders.company', 'c.id')
    .join('properties as p', 'workOrders.property', 'p.id')
    .join('priority as pr', 'workOrders.priority', 'pr.id')
    .join('status as s', 'workOrders.status', 's.id')
    .select(
      'workOrders.id',
      'workOrders.title',
      'workOrders.description',
      'workOrders.created_at',
      'workOrders.updated_at',
      db.raw('row_to_json(s) as status'),
      db.raw('row_to_json(pr) as priority'),
      db.raw('row_to_json(c) as co'),
      db.raw('row_to_json(p) as property'),
      db.raw(
        'ARRAY(SELECT row_to_json(images) FROM images WHERE images."workOrder" = "workOrders".id) AS images'
      ),
      db.raw(
        'ARRAY(SELECT row_to_json(comments) FROM comments WHERE comments."workOrder" = "workOrders".id) AS comments'
      ),
      db.raw('row_to_json(u) as createdBy'),
      db.raw('row_to_json(a) as assignedTo')
    )
    .distinctOn('workOrders.id');
};

const findBy = (filter) => {
  return db('workOrders')
    .where(filter)
    .join('profiles as u', 'workOrders.createdBy', 'u.id')
    .join('profiles as a', 'workOrders.assignedTo', 'a.id')
    .join('companies as c', 'workOrders.company', 'c.id')
    .join('properties as p', 'workOrders.property', 'p.id')
    .join('priority as pr', 'workOrders.priority', 'pr.id')
    .join('status as s', 'workOrders.status', 's.id')
    .select(
      'workOrders.id',
      'workOrders.title',
      'workOrders.description',
      'workOrders.created_at',
      'workOrders.updated_at',
      db.raw('row_to_json(s) as status'),
      db.raw('row_to_json(pr) as priority'),
      db.raw('row_to_json(c) as co'),
      db.raw('row_to_json(p) as property'),
      db.raw(
        'ARRAY(SELECT row_to_json(images) FROM images WHERE images."workOrder" = "workOrders".id) AS images'
      ),
      db.raw(
        'ARRAY(SELECT row_to_json(comments) FROM comments WHERE comments."workOrder" = "workOrders".id) AS comments'
      ),
      db.raw('row_to_json(u) as createdBy'),
      db.raw('row_to_json(a) as assignedTo')
    )
    .distinctOn('workOrders.id');
};

const findById = async (workOrderId) => {
  return db('workOrders')
    .where('workOrders.id', workOrderId)
    .join('profiles as u', 'workOrders.createdBy', 'u.id')
    .join('profiles as a', 'workOrders.assignedTo', 'a.id')
    .join('companies as c', 'workOrders.company', 'c.id')
    .join('properties as p', 'workOrders.property', 'p.id')
    .join('priority as pr', 'workOrders.priority', 'pr.id')
    .join('status as s', 'workOrders.status', 's.id')
    .select(
      'workOrders.id',
      'workOrders.title',
      'workOrders.description',
      'workOrders.created_at',
      'workOrders.updated_at',
      db.raw('row_to_json(s) as status'),
      db.raw('row_to_json(pr) as priority'),
      db.raw('row_to_json(c) as co'),
      db.raw('row_to_json(p) as property'),
      db.raw(
        'ARRAY(SELECT row_to_json(images) FROM images WHERE images."workOrder" = "workOrders".id) AS images'
      ),
      db.raw(
        'ARRAY(SELECT row_to_json(comments) FROM comments WHERE comments."workOrder" = "workOrders".id) AS comments'
      ),
      db.raw('row_to_json(u) as createdBy'),
      db.raw('row_to_json(a) as assignedTo')
    )
    .first();
};

const create = async (workOrder) => {
  return db('workOrders').insert(workOrder).returning('*');
};

const update = (id, workOrder) => {
  return db('workOrders')
    .where({ id: id })
    .first()
    .update(workOrder)
    .returning('*');
};

const remove = async (id) => {
  return await db('workOrders').where({ id }).del();
};

module.exports = {
  findAll,
  findByUser,
  findByCompany,
  findBy,
  findById,
  create,
  update,
  remove,
};
