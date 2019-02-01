
exports.up = function(knex) {
  return knex.schema.createTable('admin', (table) => {
      table.increments('id');
      table.string('email');
      table.string('password');
    }).then (() => {
    return knex.schema.createTable('poll', (table) => {
      table.increments('id');
      table.string('question');
      table.string('description');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.date('dt_expire');
      table.integer('admin_id').unsigned().notNullable();
      table.foreign('admin_id').references('id').inTable('admin').onDelete('CASCADE');
    })
  }).then (() => {
    return knex.schema.createTable('option', (table) => {
      table.increments('id');
      table.string('label');
      table.integer('score');
      table.integer('poll_id').unsigned().notNullable();
      table.foreign('poll_id').references('id').inTable('poll').onDelete('CASCADE');
    })
  }).then (() => {
    return knex.schema.createTable('vote', (table) => {
      table.increments('id');
      table.integer('score');
      table.integer('option_id').unsigned().notNullable();
      table.foreign('option_id').references('id').inTable('option').onDelete('CASCADE');
    });
  });
};

// exports.down = function(knex) {
//   return knex.schema.dropTable('admin') //.then(() => {
//     // return knex.schema.dropTable('poll').then(() => {
//     //   return knex.schema.dropTable('option').then(() => {
//     //     return knex.schema.dropTable('vote').then(() => {
//     //     })
//     //   })
//     // })
//   })
// }


// exports.down = function(knex) {
//   return knex.schema.dropTableIfExists('admin', () => {
//     return knex.schema.dropTableIfExists('poll', () => {
//       return knex.schema.dropTableIfExists('option', () => {
//         return knex.schema.dropTableIfExists('vote')
//       })
//     })
//   })
// };

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('vote')
  ])
};

