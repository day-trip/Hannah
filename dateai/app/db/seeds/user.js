const transformer = require('knex-csv-transformer').transformer;

exports.seed = transformer.seed({
  table: 'user',
  file: "",
  transformers: [],
});
