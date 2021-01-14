const db = require('../../data/db-config');

const findAll = async () => {
  return await db('companies');
};

const findBy = (filter) => {
  return db('companies')
    .from('companies as c')
    .where(filter)
    .join('properties', 'properties.company', 'c.id')
    .join('profiles', 'profiles.company', 'c.id')
    .select(
      'c.id',
      'c.name',
      db.raw(
        'ARRAY(SELECT row_to_json(profiles) FROM profiles WHERE profiles.company = c.id) AS users'
      ),
      db.raw(
        'ARRAY(SELECT row_to_json(properties) FROM properties WHERE properties.company = c.id) AS properties'
      )
    );
};

const findById = async (id) => {
  return db('companies')
    .from('companies as c')
    .where({ id })
    .first()
    .select(
      'c.id',
      'c.name',
      db.raw(
        'ARRAY(SELECT row_to_json(profiles) FROM profiles WHERE profiles.company = c.id) AS users'
      ),
      db.raw(
        'ARRAY(SELECT row_to_json(properties) FROM properties WHERE properties.company = c.id) AS properties'
      )
    );
};

const create = async (company) => {
  return db('companies').insert(company).returning('*');
};

const update = (id, company) => {
  console.log(company);
  return db('companies')
    .where({ id: id })
    .first()
    .update(company)
    .returning('*');
};

const remove = async (id) => {
  return await db('companies').where({ id }).del();
};

module.exports = {
  findAll,
  findBy,
  findById,
  create,
  update,
  remove,
};
