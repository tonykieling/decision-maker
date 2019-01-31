exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('vote', function(table){
      table.increments('id');
      table.integer('score');
      table.integer('option_id').unsigned().notNullable();
      table.foreign('option_id').references('id').inTable('option');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('vote')
  ])
};


