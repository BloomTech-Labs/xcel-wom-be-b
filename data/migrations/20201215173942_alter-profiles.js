exports.up = (knex) => {
  return knex.schema.table('profiles', function (table) {
    table.integer('role').unsigned();
    table.integer('company').unsigned();
  });
};

exports.down = (knex) => {
  return knex.schema.table('profiles', function (table) {
    table.dropColumn('company');
    table.dropColumn('role');
  });
};
