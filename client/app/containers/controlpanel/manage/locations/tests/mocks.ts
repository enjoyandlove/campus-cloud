export const mockTime = {
  value: 1800,
  label: '12:30 AM'
};

export const mockSchedule = [
  {
    day: 2,
    items: [
      {
        url: '',
        name: '',
        description: '',
        end_time: 18000,
        start_time: 3600
      }
    ]
  }
];

export const emptyForm = {
  city: null,
  name: null,
  phone: null,
  email: null,
  country: null,
  address: null,
  latitude: null,
  province: null,
  longitude: null,
  image_url: null,
  short_name: null,
  description: null,
  postal_code: null,
  category_id: null,
  links: [],
  schedule: []
};

export const mockCategories = [
  {
    id: 123,
    category_type: 1,
    is_default: true,
    name: 'Hello world',
    image_url: 'ab.jpeg',
    category_type_name: 'dining'
  },
  {
    id: 1234,
    category_type: 4,
    is_default: true,
    name: 'Hello world',
    image_url: 'ab.jpeg',
    category_type_name: 'dining'
  }
];

export const mockLocations = [
  {
    id: 123,
    phone: 125488,
    category_id: 1,
    city: 'Karachi',
    province: 'Sindh',
    short_name: 'LMC',
    latitude: 78584585,
    country: 'Pakistan',
    name: 'Hello World!',
    postal_code: '74000',
    longitude: -45857858,
    category_img_url: '',
    category_name: 'Dining',
    image_url: 'thumb.jpeg',
    address: 'Clifton Block #04',
    email: 'test@oohlalamobile.com',
    description: 'test description',
    links: [],
    schedule: []
  },
  {
    id: 1234,
    phone: 125488,
    category_id: 1,
    city: 'Karachi',
    province: 'Sindh',
    short_name: 'LMC',
    latitude: 78584585,
    country: 'Pakistan',
    name: 'Hello World!',
    postal_code: '74000',
    longitude: -45857858,
    category_img_url: '',
    category_name: 'Dining',
    image_url: 'thumb.jpeg',
    address: 'Clifton Block #04',
    email: 'test@oohlalamobile.com',
    description: 'test description',
    links: [],
    schedule: []
  }
];
