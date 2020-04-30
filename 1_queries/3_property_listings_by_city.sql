SELECT properties.*, AVG(rating) AS average_rating
FROM property_reviews
JOIN properties ON properties.id = property_id
WHERE city LIKE '%ancouver'
GROUP BY properties.id, properties.title, properties.cost_per_night
HAVING avg(property_reviews.rating) >= 4
ORDER BY properties.cost_per_night
limit 10;
