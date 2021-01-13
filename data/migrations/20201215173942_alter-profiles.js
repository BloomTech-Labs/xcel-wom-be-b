exports.up = (knex) => {
  return knex.schema.table('profiles', function (table) {
    table.integer('role').unsigned();
    table
      .foreign('role')
      .references('roles.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.integer('company').unsigned();
    table
      .foreign('company')
      .references('companies.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

exports.down = (knex) => {
  return knex.schema.table('profiles', function (table) {
    table.dropForeign('company');
    table.dropColumn('company');
    table.dropForeign('role');
    table.dropColumn('role');
  });
};
