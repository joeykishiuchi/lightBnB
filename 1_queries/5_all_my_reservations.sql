SELECT reservations.*, properties.*, AVG(rating) AS average_rating
FROM property_reviews
JOIN properties ON property_id = properties.id
JOIN reservations ON properties.id = reservations.property_id
WHERE reservations.guest_id = 1
GROUP BY properties.id, reservations.id, reservations.end_date
HAVING reservations.end_date < NOW()::date
ORDER BY reservations.start_date
LIMIT 10;


