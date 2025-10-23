# Diet App - React Frontend & Node.js Backend

## Description

This web application allows users to browse, search, and view nutritional information for a wide range of food products. It features a React-based frontend built using the Minimal UI template (Material UI) and connects to a custom Node.js/Express backend API which serves data from a MySQL database. The food data originates from the Open Food Facts dataset.

## Features

* **Food Grid View:** Displays an initial preview of food items with images and names.
* **Search Functionality:** Allows users to search for food products by name via the navigation bar search. Search results are displayed on the food grid page.
* **Detailed Nutrition Dashboard:** Clicking on a food item navigates to a dashboard view showing detailed nutritional information, including:
    * Macronutrient breakdown (Protein, Carbs, Fat) in a pie chart.
    * Key nutrient summaries (Calories, NutriScore, Sugars, Salt).
    * Product image and brand information.
* **Food Data Table:** A sortable and paginated table view displaying detailed information (Name, PNNS Group, NutriScore, Brand, Categories) for all food items.
* **Backend API:** A Node.js/Express server handles requests from the frontend and interacts with the MySQL database.

## Technologies Used

**Frontend:**

* React
* TypeScript
* Material UI (using Minimal UI template)
* React Router
* Fetch API (for backend communication)

**Backend:**

* Node.js
* Express
* MySQL2 (MySQL driver)
* CORS

**Database:**

* MySQL

**Data Processing (ETL):**

* Python (Jupyter Notebook)
* Pandas
* Numpy
* matplotlib

## Data Source

The food product data was sourced from the [Open Food Facts](https://world.openfoodfacts.org/) dataset. An ETL process using Python and Pandas was performed to clean and prepare the data before loading it into the MySQL database (see `data/etl.ipynb`).

## Setup and Installation

**Prerequisites:**

* Node.js and npm (or yarn) installed.
* MySQL server installed and running.

**1. Database Setup:**

* Create a MySQL database named `fooddb`.
* Create a table named `foodtbl` within the `fooddb` database using the schema defined/implied by the ETL process (`data/etl.ipynb`) and backend queries. The key columns include `code`, `product_name`, `image_url`, nutrient columns (`energy_kcal_100g`, `proteins_100g`, etc.), `brands`, `categories`, `pnns_groups_1`, `nutriscore_score`.
* Ensure your MySQL server is running on `localhost`, port `3306`, with user `root` and **no password** (as configured in `dietapp_backend/server.js`). Modify `dietapp_backend/server.js` if your credentials differ.
* Load the data processed by `data/etl.ipynb` into the `foodtbl` table.

**2. Backend Setup:**

* Navigate to the `dietapp_backend` directory:
    ```bash
    cd dietapp_backend
    ```
* Install dependencies:
    ```bash
    npm install
    ```
* Run the backend server:
    ```bash
    npm start
    ```
* The API server should now be running on `http://localhost:3001`.

**3. Frontend Setup:**

* Navigate back to the root project directory (`dietapp_react`):
    ```bash
    cd ..
    ```
* Install dependencies:
    ```bash
    npm install
    # or yarn install
    ```
* Run the frontend development server:
    ```bash
    npm run dev
    # or yarn dev
    ```
* The React application should now be running, typically on `http://localhost:3039` (or another port if specified). Ensure the `cors` origin in `dietapp_backend/server.js` matches the port your React app runs on.

## API Endpoints (Backend - `http://localhost:3001`)

* `GET /api/foods/preview`: Returns the `code`, `product_name`, and `image_url` for the first 30 food items.
* `GET /api/foods/table`: Returns detailed columns (`code`, `product_name`, `pnns_groups_1`, `nutriscore_score`, `brands`, `image_url`, `categories`) for all food items.
* `GET /api/foods/search?q={searchTerm}`: Returns `code`, `product_name`, and `image_url` for foods matching the search term.
* `GET /api/food/{code}`: Returns detailed nutritional information for a single food item specified by its `code`.
