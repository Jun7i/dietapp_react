import { useSearchParams } from 'react-router-dom'; // 1. Import useSearchParams
import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { FoodItem } from '../food-item';
import { FoodSort } from '../food-sort';
import { FoodFilters } from '../food-filters';
import { CartIcon } from '../food-cart-widget';

import type { FiltersProps } from '../food-filters';

// ----------------------------------------------------------------------

const GENDER_OPTIONS = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'kids', label: 'Kids' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'shose', label: 'Shose' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'accessories', label: 'Accessories' },
];

const RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

const PRICE_OPTIONS = [
  { value: 'below', label: 'Below $25' },
  { value: 'between', label: 'Between $25 - $75' },
  { value: 'above', label: 'Above $75' },
];

const COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

const defaultFilters = {
  price: '',
  gender: [GENDER_OPTIONS[0].value],
  colors: [COLOR_OPTIONS[4]],
  rating: RATING_OPTIONS[0],
  category: CATEGORY_OPTIONS[0].value,
};


// Define an interface for your food data structure based on your DB columns
interface FoodData {
  code: string;
  image_url: string;
  product_name: string;
  // Note: nutrients will be missing from search, we handle this below
}


export function FoodView() {
  const [foods, setFoods] = useState<FoodData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams(); // 2. Get URL search params
  const searchTerm = searchParams.get('search'); // 3. Get the 'search' param

  useEffect(() => {
    const fetchFoods = async () => {
      setIsLoading(true);
      setError(null);
      
      // 4. Conditionally set the URL
      let url = 'http://localhost:3001/api/foods/preview'; // Default URL
      let fetchErrorMsg = 'Failed to load foods';

      if (searchTerm) {
        url = `http://localhost:3001/api/foods/search?q=${encodeURIComponent(searchTerm)}`;
        fetchErrorMsg = `Failed to find results for "${searchTerm}"`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: FoodData[] = await response.json();
        setFoods(data);
      } catch (e) {
         console.error(fetchErrorMsg, e);
         if (e instanceof Error) {
           setError(`${fetchErrorMsg}: ${e.message}`);
         } else {
           setError(`${fetchErrorMsg} due to an unknown error.`);
         }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoods();
  }, [searchTerm]); // 5. Add searchTerm to dependency array. This re-runs the fetch when the URL changes!

  // if (isLoading) return <DashboardContent><Typography>Loading...</Typography></DashboardContent>;
  if (isLoading) return <DashboardContent><Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box></DashboardContent>;
  if (error) return <DashboardContent><Typography>Error: {error}</Typography></DashboardContent>;

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        {/* 6. Make the title dynamic */}
        {searchTerm ? `Search Results for "${searchTerm}"` : 'Food'}
      </Typography>

      {/* You may want to hide filters/sort when showing search results */}
      {/* <FoodSort /> */}
      {/* <FoodFilters /> */}

      <Grid container spacing={3}>
         {foods.length > 0 ? (
           foods.map((food) => (
             <Grid key={food.code} size={{ xs: 12, sm: 6, md: 3 }}>
               <FoodItem food={{
                 id: food.code,
                 name: food.product_name || 'Unnamed Food',
                 coverUrl: food.image_url || 'https://static.wixstatic.com/media/69e890_7ac3191467e244b3845421625a7f9e11~mv2.png/v1/fill/w_319,h_321,al_c,q_85,enc_auto/IMG_1596.png',
                 // 7. Handle missing nutrients (search doesn't return them)
                 nutrients: {} 
               }} />
             </Grid>
           ))
         ) : (
            // 8. Show a dynamic "no results" message
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ p: 3, textAlign: 'center' }}>
                {searchTerm ? 'No food items found matching your search.' : 'No food items found.'}
              </Typography>
            </Grid>
         )}
      </Grid>
      
      {/* <FoodCartWidget /> */}
    </DashboardContent>
  );
}
