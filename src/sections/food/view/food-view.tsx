import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';

import { _food } from 'src/_mock';
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
  generic_name?: string;
  // ... add other relevant columns from foodtbl
  fat_100g?: number;
  carbohydrates_100g?: number;
  proteins_100g?: number;
  energy_kcal_100g?: number;
  // ... etc.
}

// export function FoodView() {
//   const [sortBy, setSortBy] = useState('featured');

//   const [openFilter, setOpenFilter] = useState(false);

//   const [filters, setFilters] = useState<FiltersProps>(defaultFilters);

//   const handleOpenFilter = useCallback(() => {
//     setOpenFilter(true);
//   }, []);

//   const handleCloseFilter = useCallback(() => {
//     setOpenFilter(false);
//   }, []);

//   const handleSort = useCallback((newSort: string) => {
//     setSortBy(newSort);
//   }, []);

//   const handleSetFilters = useCallback((updateState: Partial<FiltersProps>) => {
//     setFilters((prevValue) => ({ ...prevValue, ...updateState }));
//   }, []);

//   const canReset = Object.keys(filters).some(
//     (key) => filters[key as keyof FiltersProps] !== defaultFilters[key as keyof FiltersProps]
//   );

//   return (
//     <DashboardContent>
//       <CartIcon totalItems={8} />

//       <Typography variant="h4" sx={{ mb: 5 }}>
//         Food
//       </Typography>
//       <Box
//         sx={{
//           mb: 5,
//           display: 'flex',
//           alignItems: 'center',
//           flexWrap: 'wrap-reverse',
//           justifyContent: 'flex-end',
//         }}
//       >
//         <Box
//           sx={{
//             my: 1,
//             gap: 1,
//             flexShrink: 0,
//             display: 'flex',
//           }}
//         >
//           <FoodFilters
//             canReset={canReset}
//             filters={filters}
//             onSetFilters={handleSetFilters}
//             openFilter={openFilter}
//             onOpenFilter={handleOpenFilter}
//             onCloseFilter={handleCloseFilter}
//             onResetFilter={() => setFilters(defaultFilters)}
//             options={{
//               genders: GENDER_OPTIONS,
//               categories: CATEGORY_OPTIONS,
//               ratings: RATING_OPTIONS,
//               price: PRICE_OPTIONS,
//               colors: COLOR_OPTIONS,
//             }}
//           />

//           <FoodSort
//             sortBy={sortBy}
//             onSort={handleSort}
//             options={[
//               { value: 'featured', label: 'Featured' },
//               { value: 'newest', label: 'Newest' },
//               { value: 'priceDesc', label: 'Price: High-Low' },
//               { value: 'priceAsc', label: 'Price: Low-High' },
//             ]}
//           />
//         </Box>
//       </Box>

//       <Grid container spacing={3}>
//         {_food.map((food) => (
//           <Grid key={food.id} size={{ xs: 12, sm: 6, md: 3 }}>
//             <FoodItem food={food} />
//           </Grid>
//         ))}
//       </Grid>

//       <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} />
//     </DashboardContent>
//   );

export function FoodView() {
  const [foods, setFoods] = useState<FoodData[]>([]); // Use the interface here
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ... other state like filters, sort, etc.

  useEffect(() => {
    const fetchFoods = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3001/api/foods/preview'); // Your backend API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: FoodData[] = await response.json(); // Type assertion
        setFoods(data);
      } catch (e) {
         console.error("Failed to fetch foods:", e);
         if (e instanceof Error) {
           setError(`Failed to load foods: ${e.message}`);
         } else {
           setError("Failed to load foods due to an unknown error.");
         }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoods();
  }, []); // Empty dependency array means this runs once on mount

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // ... rest of your component logic (filters, sorting, etc.)

  return (
    <DashboardContent>
      {/* ... Header, Filters, Sort components ... */}
       <Typography variant="h4" sx={{ mb: 5 }}>
         Food
       </Typography>
      {/* ... Filters and Sort components ... */}

      <Grid container spacing={3}>
         {/* Map over the fetched foods array */}
         {foods.length > 0 ? (
           foods.map((food) => (
             <Grid key={food.code} size={{ xs: 12, sm: 6, md: 3 }}>
               {/* Adapt FoodItemProps based on your FoodData interface */}
               <FoodItem food={{
                 id: food.code, // Assuming 'code' is the unique identifier
                 name: food.product_name || 'Unnamed Food', // Use product_name from DB
                 coverUrl: food.image_url || 'https://toppng.com/uploads/preview/clipart-free-seaweed-clipart-draw-food-placeholder-11562968708qhzooxrjly.png', // Use image_url or a default
                 nutrients: { // Map relevant nutrient data
                    energy: food.energy_kcal_100g,
                    proteins: food.proteins_100g,
                    carbohydrates: food.carbohydrates_100g,
                    fat: food.fat_100g,
                 }
                 // Map other necessary props for FoodItem
               }} />
             </Grid>
           ))
         ) : (
            <Typography sx={{ p: 3 }}>No food items found.</Typography>
         )}
      </Grid>
       {/* ... Pagination ... */}
    </DashboardContent>
  );
}

