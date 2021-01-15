exports.up = (knex) => {
  return knex.schema.createTable('workOrders', function (table) {
    table.increments('id').notNullable().unique().primary();
    table.string('title');
    table.string('description');
    table.integer('company').unsigned();
    table
      .foreign('company')
      .references('companies.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.integer('property').unsigned();
    table.string('createdBy');
    table
      .foreign('createdBy')
      .references('profiles.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.string('assignedTo');
    table.integer('priority').unsigned();
    table
      .foreign('priority')
      .references('priority.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.integer('status').unsigned();
    table
      .foreign('status')
      .references('status.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('workOrders');
};
