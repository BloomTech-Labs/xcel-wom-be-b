exports.up = function (knex) {
  return knex.schema
    .table('roles', function (table) {
      table.dropForeign('company');
      table
        .foreign('company')
        .references('companies.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    })
    .table('properties', function (table) {
      table.dropForeign('company');
      table
        .foreign('company')
        .references('companies.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    })
    .table('workOrders', function (table) {
      table.dropForeign('company');
      table
        .foreign('company')
        .references('companies.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.dropForeign('createdBy');
      table
        .foreign('createdBy')
        .references('profiles.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.dropForeign('priority');
      table
        .foreign('priority')
        .references('priority.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.dropForeign('status');
      table
        .foreign('status')
        .references('status.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
};

exports.down = function () {};
