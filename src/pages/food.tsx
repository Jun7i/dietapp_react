import { CONFIG } from 'src/config-global';

import { FoodView } from 'src/sections/food/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Food - ${CONFIG.appName}`}</title>

      <FoodView />
    </>
  );
}
