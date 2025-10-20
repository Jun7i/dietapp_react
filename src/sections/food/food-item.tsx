import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

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
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {food.status && renderStatus}
        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          {food.name}
        </Link>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {renderNutrients}
        </Box>
      </Stack>
    </Card>
  );
}
