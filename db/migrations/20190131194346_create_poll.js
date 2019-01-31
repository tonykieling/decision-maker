
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('poll', function(table){
      table.increments('id');
      table.string('question');
      table.string('description');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.date('dt_expire');
      table.integer('admin_id').unsigned().notNullable();
      table.foreign('admin_id').references('id').inTable('admin');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('poll')
  ])
};



