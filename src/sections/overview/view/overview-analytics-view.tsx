import { useState, useEffect } from 'react';
import { data, useSearchParams } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

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

// ----------------------------------------------------------------------

type PieChartData = {
  label: string;
  value: number;
};

type FetchedFoodData = {
  product_name: string;
  proteins_100g: number;
  carbohydrates_100g: number;
  fat_100g: number;
  energy_100g: number;
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
  useEffect(() => {
    const fetchFoodDetails = async () => {
      if (!foodCode) {
        // No food code in URL, reset to default
        setPieData(DEFAULT_PIE_DATA);
        setPieTitle('Nutrition Sources');
        setWelcomeName('User'); // Reset welcome message
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/api/food/${foodCode}`);
        if (!response.ok) {
          throw new Error('Food not found');
        }
        const data: FetchedFoodData = await response.json();

        // Process data for the pie chart
        const processedData = [
          { label: 'Protein (g)', value: data.proteins_100g || 0 },
          { label: 'Carbs (g)', value: data.carbohydrates_100g || 0 },
          { label: 'Fat (g)', value: data.fat_100g || 0 },
          // { label: 'Calories', value: data.energy_kcal_100g || 0 },
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
      }
    };

    fetchFoodDetails();
  }, [foodCode]); // This dependency array is key!
  
  return (
    <DashboardContent maxWidth="xl">

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Calories (per 100g)"
            percent={2.6}
            total={100000} // need to fetch real calorie data energy_kcal_100g
            icon={<img alt="Weekly sales" src="/assets/icons/glass/ic-glass-bag.svg" />}
            // chart={{
            //   categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            //   series: [22, 8, 35, 50, 82, 84, 77, 12],
            // }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Nutriscore"
            percent={-0.1}
            total={1352831} // need to fetch real nutriscore data nutriscore_score
            color="secondary"
            icon={<img alt="New users" src="/assets/icons/glass/ic-glass-users.svg" />}
            // chart={{
            //   categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            //   series: [56, 47, 40, 62, 73, 30, 23, 54],
            // }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Total Sugars (per 100g)"
            percent={2.8}
            total={1723315} // need to fetch real sugar data sugars_100g
            color="warning"
            icon={<img alt="Purchase orders" src="/assets/icons/glass/ic-glass-buy.svg" />}
            // chart={{
            //   categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            //   series: [40, 70, 50, 28, 70, 75, 7, 64],
            // }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Salt (per 100g)"
            percent={3.6}
            total={234} // need to fetch real salt data salt_100g
            color="error"
            icon={<img alt="Messages" src="/assets/icons/glass/ic-glass-message.svg" />}
            // chart={{
            //   categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            //   series: [56, 30, 23, 54, 47, 40, 62, 73],
            // }}
          />
        </Grid>
        
        {/* <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Nutrition Sources"
            chart={{
              series: [
                { label: 'pie 1', value: 3500 },
                { label: 'pie 2', value: 2500 },
                { label: 'pie 3', value: 1500 },
                { label: 'pie 4', value: 500 },
              ],
            }}
          />
        </Grid> */}

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title={pieTitle} // Use state for title
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
              categories: ['Saturated Fat', 'Fiber', 'Calcium', 'Iron', 'Vitamin C'], 
              series: [
                { name: 'Team A', data: [43, 33, 22, 37, 67,] }, // need to fetch saturated-fat_100g, fiber_100g, calcium_100g, iron_100g, vitamin-c_100g
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
{/* 
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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
