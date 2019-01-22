export const emptyForm = {
  name: null,
  img_url: null,
  category_type_id: null
};

export const filledForm = {
  img_url: 'img.jpeg',
  name: 'Hello world',
  category_type_id: 1
};

export const mockCategories = [
  {
    id: 123,
    category_type: 1,
    is_default: true,
    img_url: 'img.jpeg',
    name: 'Hello world',
    category_type_id: 1,
    category_type_name: 'dining'
  },
  {
    id: 1234,
    category_type: 4,
    is_default: true,
    img_url: 'img.jpeg',
    name: 'Hello world',
    category_type_id: 2,
    category_type_name: 'dining'
  }
];
