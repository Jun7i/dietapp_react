import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { Box } from '@mui/material';
import { varAlpha } from 'minimal-shared/utils';

import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

// import {
//   // ... (keep other imports)
//   AnalyticsCurrentVisits,
//   // ... (keep other imports)
// } from 'src/sections/overview';

// ----------------------------------------------------------------------

type PieChartData = {
  label: string;
  value: number;
};

type FetchedFoodData = {
  product_name: string;
  brands: string | null;
  image_url: string | null;
  energy_100g: number | null;
  nutriscore_score: number | null;
  proteins_100g: number | null;
  carbohydrates_100g: number | null;
  fat_100g: number | null;
  sugars_100g: number | null;
  fiber_100g: number | null;
  sodium_100g: number | null;
  salt_100g: number | null;
  calcium_100g: number | null;
  iron_100g: number | null;
  vitamin_c_100g: number | null;
  vitamin_a_100g: number | null;
};

const DEFAULT_PIE_DATA = [
  { label: 'pie 1', value: 3500 },
  { label: 'pie 2', value: 2500 },
  { label: 'pie 3', value: 1500 },
  { label: 'pie 4', value: 500 },
];

// ----------------------------------------------------------------------
export function OverviewAnalyticsView() {
  const [searchParams] = useSearchParams();
  const foodCode = searchParams.get('food');

  // 5. Create state for our dynamic chart data and title
  const [pieData, setPieData] = useState<PieChartData[]>(DEFAULT_PIE_DATA);
  const [pieTitle, setPieTitle] = useState('Nutrition Sources');
  const [welcomeName, setWelcomeName] = useState('User'); // State for the "Hi, Welcome back"

  const [foodDetails, setFoodDetails] = useState<FetchedFoodData | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state
  useEffect(() => {
    const fetchFoodDetails = async () => {
      if (!foodCode) {
        // No food code in URL, reset to default
        setPieData(DEFAULT_PIE_DATA);
        setPieTitle('Nutrition Sources');
        setWelcomeName('User'); // Reset welcome message
        setFoodDetails(null); // Reset food details
        setIsLoading(false);
        setError(null);
        return;
      }
      setIsLoading(true); // Start loading
      setError(null);
      setFoodDetails(null);
      try {
        const response = await fetch(`http://localhost:3001/api/food/${foodCode}`);
        if (!response.ok) {
          throw new Error('Food not found');
        }
        const data: FetchedFoodData = await response.json();
        setFoodDetails(data);
        // Process data for the pie chart
        const processedData = [
          { label: 'Protein (g)', value: data.proteins_100g || 0 },
          { label: 'Carbs (g)', value: data.carbohydrates_100g || 0 },
          { label: 'Fat (g)', value: data.fat_100g || 0 },
        ];
        
        // Filter out any 0-value nutrients for a cleaner chart
        const finalData = processedData.filter(item => item.value > 0);

        setPieData(finalData.length > 0 ? finalData : [{ label: 'No Data', value: 1 }]);
        setPieTitle(`Macronutrients for ${data.product_name}`);
        setWelcomeName(data.product_name); // Update welcome message
        
      } catch (error) {
        console.error("Failed to fetch food details:", error);
        // On error, reset to default
        setPieData(DEFAULT_PIE_DATA);
        setPieTitle('Could not load nutrition data');
        setWelcomeName('User');
        setFoodDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodDetails();
  }, [foodCode]); // This dependency array is key!
  if (isLoading) {
    return <Typography sx={{ p: 3 }}>Loading food details...</Typography>;
  }

  if (error && foodCode) { // Only show error if we were trying to load a specific food
     return <Typography sx={{ p: 3, color: 'error.main' }}>Error: {error}</Typography>;
  }
  if (!foodCode || !foodDetails) {
     return (
       <>
         <Typography variant="h4" sx={{ mb: 5 }}>
           Hi, Welcome back 👋
         </Typography>
         <Typography sx={{ mb: 5 }}>
           Click on a food item from the Food page to see its details here.
         </Typography>
         {/* Optionally, display default summary widgets or charts here */}
       </>
     );
   }

  return (
    <DashboardContent maxWidth="xl">

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          
          <Card sx={{ p: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            backgroundColor: 'common.white',
            height: '100%' }}>
              {foodDetails.image_url && (
                  <Box
                      component="img"
                      src={foodDetails.image_url}
                      alt={foodDetails.product_name}
                      sx={{ width: 'auto', maxHeight: 90, mb: 2, borderRadius: 1 }}
                  />
              )}
              <Typography variant="h6">{foodDetails.product_name}</Typography>
              {/* You could add more details here */}
            </Card>
        </Grid>

        

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Nutriscore"
            percent={-0.1}
            total={foodDetails.nutriscore_score ?? 0}
            color="secondary"
            icon={<img alt="Nutri Score" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Nutri-score-A.svg/360px-Nutri-score-A.svg.png?20170815140554" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Sugars (per 100g)"
            percent={2.8}
            total={foodDetails.sugars_100g ?? 0}
            color="warning"
            icon={<img alt="Purchase orders" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Calories (per 100g)"
            percent={3.6}
            total={foodDetails.energy_100g ?? 0}
            color="error"
            icon={<img alt="Messages" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>
        

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title=' Pie Chart' // Use state for title
            chart={{
              series: pieData, // Use state for chart data
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Detailed Nutrient Profile (per 100g)"
            // subheader="(+43%) than last year"
            chart={{
              categories: ['Sodium', 'Fiber', 'Calcium', 'Iron', 'Vitamin C', 'Salt'],
              series: [
                { name: 'Team A', 
                  data: [
                    foodDetails.sodium_100g ?? 0, 
                    foodDetails.fiber_100g ?? 0, 
                    foodDetails.calcium_100g ?? 0, 
                    foodDetails.iron_100g ?? 0, 
                    foodDetails.vitamin_c_100g ?? 0,
                    foodDetails.salt_100g ?? 0] },
              ],
            }}
          />
        </Grid>

        {/* <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid> */}


      </Grid>
    </DashboardContent>
  );
}