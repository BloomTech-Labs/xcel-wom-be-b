exports.up = (knex) => {
  return knex.schema.createTable('images', function (table) {
    table.increments('id').notNullable().unique().primary();
    table.string('url');
    table.string('user');
    table
      .foreign('user')
      .references('profiles.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.integer('workOrder').unsigned();
    table
      .foreign('workOrder')
      .references('workOrders.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('images');
};
