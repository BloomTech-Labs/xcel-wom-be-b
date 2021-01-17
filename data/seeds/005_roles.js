const genCode = require('../../helpers/genRandomCodes');

const roles = [
  { name: 'Admin', company: 1, userLevel: 4, code: genCode(6) },
  { name: 'Property Manager', company: 1, userLevel: 4, code: genCode(6) },
  { name: 'IT', company: 1, userLevel: 4, code: genCode(6) },
  { name: 'Supervisor', company: 1, userLevel: 3, code: genCode(6) },
  { name: 'Maintenance', company: 1, userLevel: 2, code: genCode(6) },
  { name: 'Tenant', company: 1, userLevel: 1, code: genCode(6) },
];

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('roles')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('roles').insert(roles);
    });
};
