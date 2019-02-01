
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('admin', function(table){
      table.increments('id');
      table.string('email');
      table.string('password');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('admin'),
  ])
};


