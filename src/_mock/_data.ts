import {
  _id,
  _price,
  _times,
  _brand,
  _category,
  _foodName,
  _foodNames,
} from './_mock';

// ----------------------------------------------------------------------

export const _users = [...Array(24)].map((_, index) => ({
  id: _id(index),
  name: _foodName(index),
  brand: _brand(index),
  categories: _category(index),
  food_img: `https://static.wixstatic.com/media/69e890_7ac3191467e244b3845421625a7f9e11~mv2.png/v1/fill/w_319,h_321,al_c,q_85,enc_auto/IMG_1596.png`,
  score: [
      'Score A',
    ][index] || 'unknown',
  pnns:
    [
      'Fruits and vegetables',
      'Sugary snacks',
    ][index] || 'unknown',
}));

// ----------------------------------------------------------------------


const COLORS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];
