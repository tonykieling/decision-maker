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
      { question: 'Food?', admin_id: id(ids)},
      { question: 'Hiking where?', admin_id: id(ids)},
    ]).returning('id');
  })
  // .then((ids) => {
  //   return knex('option').insert([
  //     {label: 'Labamba', poll_id: id(ids)},
  //     {label: 'Indiana Jones', poll_id: id(ids)},
  //     {label: 'Rock I', poll_id: id(ids)},
  //     {label: 'Back to the Future I', poll_id: id(ids)},
  //     {label: 'Conan the Barbarian ', poll_id: id(ids)},
  //   ]).returning('id')
  // })
  // // TODO: insert options and votes
  // https://medium.com/@emilygao/basic-guide-for-knex-js-c9ead1df0574
  // https://devhints.io/knex#insert-1
  // http://zetcode.com/javascript/knex/
};
