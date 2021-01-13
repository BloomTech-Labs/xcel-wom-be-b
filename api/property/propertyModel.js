const db = require('../../data/db-config');

const findAll = async () => {
  return await db('properties');
};

const findBy = (filter) => {
  return db('properties').where(filter).select('*');
};

const findById = async (id) => {
  return db('properties').where({ id }).first().select('*');
};

const create = async (property) => {
  return db('properties').insert(property).returning('*');
};

const update = (id, property) => {
  console.log(property);
  return db('properties')
    .where({ id: id })
    .first()
    .update(property)
    .returning('*');
};

const remove = async (id) => {
  return await db('properties').where({ id }).del();
};

module.exports = {
  findAll,
  findBy,
  findById,
  create,
  update,
  remove,
};
