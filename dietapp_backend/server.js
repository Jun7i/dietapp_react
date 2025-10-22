
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors({ origin: 'http://localhost:3039' }));

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fooddb',
  port: 3306,
};

// --- NEW ENDPOINT 1: For "Food Page" Grid ---
app.get('/api/foods/preview', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const placeholderUrl = 'https://static.wixstatic.com/media/69e890_7ac3191467e244b3845421625a7f9e11~mv2.png/v1/fill/w_319,h_321,al_c,q_85,enc_auto/IMG_1596.png';
    
    // Fetch only foods that have a *real* image (not the placeholder)
    const [rows] = await connection.execute(
      `
      SELECT code, product_name, image_url
      FROM foodtbl
      WHERE image_url IS NOT NULL
        AND image_url != ''
        AND image_url != ?
      LIMIT 20;
      `,
      [placeholderUrl]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching food preview data:', error);
    res.status(500).json({ error: 'Failed to fetch preview data' });
  } finally {
    if (connection) await connection.end();
  }
});

// --- NEW ENDPOINT 2: "Food Table" (replaces User page) ---
// This route gives ALL items with detailed info for the table.
app.get('/api/foods/table', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // Query for all data. Add/remove columns as you need.
    const [rows] = await connection.execute(
      'SELECT code, product_name, image_url, brands, categories, energy_kcal_100g, proteins_100g, carbohydrates_100g, fat_100g, salt_100g, sugars_100g FROM foodtbl limit 10;'
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching food table data:', error);
    res.status(500).json({ error: 'Failed to fetch table data' });
  } finally {
    if (connection) await connection.end();
  }
});

// --- NEW ENDPOINT 3: Search Foods by Name ---
app.get('/api/foods/search', async (req, res) => {
  const searchTerm = req.query.q; // Get the search term from the query parameter 'q'

  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // Use a prepared statement to prevent SQL injection
    // The '%' wildcards mean it will find any product_name containing the searchTerm
    const query = 'SELECT code,product_name, image_url FROM foodtbl WHERE product_name LIKE ?;';
    const [rows] = await connection.execute(query, [`%${searchTerm}%`]);

    res.json(rows); // Send back the search results
  } catch (error) {
    console.error('Error searching food data:', error);
    res.status(500).json({ error: 'Failed to search for data' });
  } finally {
    if (connection) await connection.end();
  }
});
app.get('/api/food/:code', async (req, res) => {
  const { code } = req.params; // Get the code from the URL path

  if (!code) {
    return res.status(400).json({ error: 'Food code is required' });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // Query for the specific nutrients we need for the pie chart
    const query = 'SELECT product_name, proteins_100g, carbohydrates_100g, fat_100g FROM foodtbl WHERE code = ?;';
    const [rows] = await connection.execute(query, [code]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Food not found' });
    }

    res.json(rows[0]); // Send back the single food object
  } catch (error) {
    console.error('Error fetching single food data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  } finally {
    if (connection) await connection.end();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
  console.log('Available endpoints:');
  console.log('  GET http://localhost:3001/api/foods/preview  (30 items for grid)');
  console.log('  GET http://localhost:3001/api/foods/table    (All items for table)');
  // Add this new line:
  console.log('  GET http://localhost:3001/api/foods/search?q=... (Search results)');
  console.log('  GET http://localhost:3001/api/food/:code      (Single food details)');
});