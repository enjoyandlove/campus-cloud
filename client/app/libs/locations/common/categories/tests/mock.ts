export class MockModalData {}

export const emptyForm = {
  name: null,
  color: null,
  img_url: null,
  category_type_id: null
};

export const filledForm = {
  color: 'FFA416',
  img_url: 'img.jpeg',
  name: 'Hello world',
  category_type_id: 1
};

export const mockCategories = [
  {
    id: 123,
    color: 'FFA416',
    category_type: 1,
    is_default: true,
    img_url: 'img.jpeg',
    name: 'Hello world',
    category_type_id: 1,
    locations_count: 1,
    category_type_name: 'dining'
  },
  {
    id: 1234,
    color: 'CF0000',
    category_type: 4,
    is_default: true,
    img_url: 'img.jpeg',
    name: 'Hello world',
    category_type_id: 2,
    locations_count: 0,
    category_type_name: 'dining'
  }
];
