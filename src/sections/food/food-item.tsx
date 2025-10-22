import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RouterLink as RouterLink } from 'src/routes/components/router-link';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { ColorPreview } from 'src/components/color-utils';

// ----------------------------------------------------------------------

export type FoodItemProps = {
  id: string;
  name: string;
  coverUrl: string;
  nutrients?: {
    energy?: number;
    proteins?: number;
    carbohydrates?: number;
    fat?: number;
  };
  status?: string;
};

export function FoodItem({ food }: { food: FoodItemProps }) {
  const linkTo = `/?food=${food.id}`;
  const renderCover = (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      {/* ... (keep the <Label> component if you use it) ... */}
      
      {/* 3. Wrap the image Box in the RouterLink */}
      <RouterLink href={linkTo}  color="inherit">
        <Box
          component="img"
          alt={food.name}
          src={food.coverUrl}
          sx={{
            height: 1,
            width: 1,
            objectFit: 'cover',
            aspectRatio: '1/1',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        />
      </RouterLink>
    </Box>
  );
  const renderContent = (
    <Stack spacing={0.5} sx={{ p: 2 }}>
      {/* 4. Make the food name a link */}
      <Link component={RouterLink} href={linkTo} sx={{ color: 'inherit', typography: 'subtitle2' }}>
        {food.name}
      </Link>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {/* ... (keep your nutrients or other info here) ... */}
      </Stack>
    </Stack>
  );
  const renderStatus = (
    <Label
      variant="inverted"
      color={(food.status === 'sale' && 'error') || 'info'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {food.status}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={food.name}
      src={food.coverUrl}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderNutrients = (
    <Typography variant="subtitle2" color="text.secondary">
      {food.nutrients && (
        <>
          {food.nutrients.energy && `${food.nutrients.energy} kcal`}
          {food.nutrients.proteins && ` • ${food.nutrients.proteins}g protein`}
        </>
      )}
    </Typography>
  );

  return (
    // <Card>
    //   <Box sx={{ pt: '100%', position: 'relative' }}>
    //     {food.status && renderStatus}
    //     {renderImg}
    //   </Box>

    //   <Stack spacing={2} sx={{ p: 3 }}>
    //     <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
    //       {food.name}
    //     </Link>

    //     <Box
    //       sx={{
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'space-between',
    //       }}
    //     >
    //       {renderNutrients}
    //     </Box>
    //   </Stack>
    // </Card>
    <Card
      sx={{
        '&:hover': {
          boxShadow: (theme) => theme.customShadows.z16,
        },
      }}
    >
      {renderCover}
      {renderContent}
    </Card>
  );
}
