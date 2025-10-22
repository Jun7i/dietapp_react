
export const _id = (index: number) => `e99f09a7-dd88-49d5-b1c8-1daf80c2d7b${index}`;

export const _times = (index: number) =>
  // 'MM/DD/YYYY'
  [
    '11/08/2023',
    '04/09/2024',
    '09/12/2023',
    '01/01/2024',
    '04/23/2024',
    '02/29/2024',
    '05/14/2024',
    '01/13/2024',
    '06/22/2024',
    '10/05/2023',
    '07/11/2024',
    '05/22/2024',
    '03/29/2024',
    '08/29/2023',
    '11/19/2023',
    '10/24/2023',
    '12/02/2023',
    '02/13/2024',
    '09/19/2023',
    '04/17/2024',
    '12/18/2023',
    '06/27/2024',
    '10/19/2023',
    '08/09/2024',
  ][index];

export const _foodName = (index: number) =>
  [
    'food 1',
  ][index];

export const _price = (index: number) =>
  [
    35.17, 57.22, 64.78, 50.79, 9.57, 61.46, 96.73, 63.04, 33.18, 36.3, 54.42, 20.52, 62.82, 19.96,
    25.93, 70.39, 23.11, 67.23, 14.31, 31.5, 26.72, 44.8, 37.87, 75.53,
  ][index];

export const _brand = (index: number) =>
  [
    'World Food Products',
  ][index] || `Brand ${index + 1}`;

export const _category = (index: number) =>
  [
    'category 1',
  ][index] || `Category ${index + 1}`; 


// this is for food with cover
export const _foodNames = (index: number) =>
  Array.from({ length: 30 }, (_, i) => `Food ${i + 1}`)[index]; 