exports.up = function (knex) {
  return knex.schema.table('roles', function (table) {
    table.string('code');
  });
};

exports.down = function (knex) {
  return knex.schema.table('roles', function (table) {
    table.dropColumn('code');
  });
};
