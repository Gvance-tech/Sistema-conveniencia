exports.seed = async (knex) => {
  await knex('settings').insert({ key: 'ui_mode', value: 'system' }).onConflict('key').ignore();
};
