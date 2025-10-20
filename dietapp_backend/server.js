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

// --- NEW ENDPOINT 1: For your "Food Page" Grid ---
// This route gives only 30 items with just name and image.
app.get('/api/foods/preview', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // Optimized query for the grid view
    const [rows] = await connection.execute(
      'SELECT code, product_name, image_url FROM foodtbl LIMIT 20;'
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching food preview data:', error);
    res.status(500).json({ error: 'Failed to fetch preview data' });
  } finally {
    if (connection) await connection.end();
  }
});

// --- NEW ENDPOINT 2: For your "Food Table" (replaces User page) ---
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


app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
  console.log('Available endpoints:');
  console.log('  GET http://localhost:3001/api/foods/preview  (30 items for grid)');
  console.log('  GET http://localhost:3001/api/foods/table    (All items for table)');
});