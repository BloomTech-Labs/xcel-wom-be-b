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

const findAllRoles = async () => {
  return await db('roles').select('*');
};

const findRoleByCode = async (code) => {
  return await db('roles').where({ code: code }).select('*').first();
};

const create = async (company) => {
  return await db('companies')
    .insert(company)
    .returning('*')
    .then(async (co) => {
      console.log(co[0]);
      const com = co[0];
      const roles = [
        { name: 'Admin', company: com.id, userLevel: 4, code: genCode(6) },
        {
          name: 'Property Manager',
          company: com.id,
          userLevel: 4,
          code: genCode(6),
        },
        { name: 'IT', company: com.id, userLevel: 4, code: genCode(6) },
        { name: 'Supervisor', company: com.id, userLevel: 3, code: genCode(6) },
        {
          name: 'Maintenance',
          company: com.id,
          userLevel: 2,
          code: genCode(6),
        },
        { name: 'Tenant', company: com.id, userLevel: 1, code: genCode(6) },
      ];
      return await db('roles')
        .insert(roles)
        .returning('*')
        .then((roles) => {
          console.log(roles);
          console.log(com);
          return co;
          // return db('companies').where({ id: com.id }).select('*');
        });
    });
  // .then(async (roles) => {
  //   return await db('companies').where({ id: roles[0].company }).select('*');
  // });
};

const createRole = async (role) => {
  role.code = genCode(6);
  return db('roles').insert(role).returning('*');
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
  findAllRoles,
  findRoleByCode,
  create,
  createRole,
  update,
  remove,
};
