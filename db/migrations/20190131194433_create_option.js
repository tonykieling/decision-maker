
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('option', function(table){
      table.increments('id');
      table.string('label');
      table.integer('score');
      table.integer('poll_id').unsigned().notNullable();
      table.foreign('poll_id').references('id').inTable('poll');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('option')
  ])
};


