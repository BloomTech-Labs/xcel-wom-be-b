exports.up = (knex) => {
  return knex.schema.createTable('comments', function (table) {
    table.increments('id').notNullable().unique().primary();
    table.string('comment');
    table.string('author');
    table
      .foreign('author')
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
  return knex.schema.dropTableIfExists('comments');
};
