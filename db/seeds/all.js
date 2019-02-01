function id(ids) {
  return ids[Math.floor(Math.random() * ids.length)];
}

exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('admin').del(),
  ])
  .then(() => {
    return knex('admin').insert([
      { email: 'first@user.com', password: '123456' },
      { email: 'second@user.com', password: '123456' },
      { email: 'third@user.com', password: '123456' }
    ]).returning('id');
  })
  .then((ids) => {
    return knex('poll').insert([
      { question: 'Movie to watch?', admin_id: id(ids)},
      { question: 'Restaurant to go?', admin_id: id(ids)},
      { question: 'What about a trip?', admin_id: id(ids)},
      { question: 'Hiking where?', admin_id: id(ids)},
    ]).returning('id');
  })
};
