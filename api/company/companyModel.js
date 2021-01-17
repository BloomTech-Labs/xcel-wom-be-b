const db = require('../../data/db-config');
const genCode = require('../../helpers/genRandomCodes');

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

const findCompanyRoles = async (companyId) => {
  return await db('roles').where({ company: companyId }).select('*');
};

const create = async (company) => {
  const co = await db('companies').insert(company).returning('*');
  console.log(co);
  const roles = [
    { name: 'Admin', company: co.id, userLevel: 4, code: genCode(6) },
    {
      name: 'Property Manager',
      company: co.id,
      userLevel: 4,
      code: genCode(6),
    },
    { name: 'IT', company: co.id, userLevel: 4, code: genCode(6) },
    { name: 'Supervisor', company: co.id, userLevel: 3, code: genCode(6) },
    { name: 'Maintenance', company: co.id, userLevel: 2, code: genCode(6) },
    { name: 'Tenant', company: co.id, userLevel: 1, code: genCode(6) },
  ];
  await db('roles').insert(roles);
  return co;
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
  findCompanyRoles,
  create,
  update,
  remove,
};
