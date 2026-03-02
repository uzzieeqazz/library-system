DELETE FROM categories
WHERE id NOT IN (
    SELECT MIN(id) FROM categories GROUP BY name_kz
);

SELECT id, name_kz FROM categories ORDER BY id;
