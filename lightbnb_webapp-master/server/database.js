const { Pool } = require('pg');
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
})

const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`
    SELECT *
    FROM users
    WHERE email = $1;
    `, [email])
    .then(res => res.rows[0]);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
    SELECT *
    FROM users
    WHERE id = $1;
    `, [id])
    .then(res => res.rows[0]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [user.name, user.email, user.password]);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
    SELECT reservations.*, properties.*, AVG(rating) AS average_rating
    FROM property_reviews
    JOIN properties ON property_id = properties.id
    JOIN reservations ON properties.id = reservations.property_id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id, reservations.end_date
    HAVING reservations.end_date < NOW()::date
    ORDER BY reservations.start_date
    LIMIT $2;
    `, [guest_id, limit])
    .then(res => res.rows);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit) {
  let queryParams = [];
  let queryString = `
  SELECT properties.*, AVG(rating) AS average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  let optionsString = '';
  
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    optionsString = `WHERE city LIKE $${queryParams.length} `;
  } else if (options.owner_id){
    queryParams.push(`%${options.owner_id}%`);
    if (!optionsString) {
      optionsString = `WHERE city LIKE $${queryParams.length} `
    } else {
      optionsString += `AND owner_id LIKE $${queryParams.length} `
    }
  } else if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    if (!optionsString) {
      optionsString = `WHERE cost_per_night <= $${queryParams.length} `
    } else {
      optionsString += `AND cost_per_night <= $${queryParams.length} `
    }
  } else if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    if (!optionsString) {
      optionsString = `WHERE cost_per_night >= $${queryParams.length} `
    } else {
      optionsString += `AND cost_per_night >= $${queryParams.length} `
    }
  } else if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    if (!optionsString) {
      optionsString = `WHERE property_reviews.rating >= $${queryParams.length} `
    } else {
      optionsString += `AND property_reviews.rating >= $${queryParams.length} `
    }
  }

  queryString += optionsString;

  limit = 10;
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};`
  
  return pool.query(queryString, queryParams)
  .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
