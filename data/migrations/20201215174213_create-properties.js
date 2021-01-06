exports.up = (knex) => {
  return knex.schema.createTable('properties', function (table) {
    table.increments('id').notNullable().unique().primary();
    table.string('name');
    table.string('address');
    table.string('imageUrl');
    table.integer('company').unsigned();
    table
      .foreign('company')
      .references('companies.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('properties');
};
