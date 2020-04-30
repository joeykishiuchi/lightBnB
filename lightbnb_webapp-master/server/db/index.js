const { Pool } = require('pg')
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
module.exports = {
  query: (string, params) => {
    return pool.query(string, params);
  },
}