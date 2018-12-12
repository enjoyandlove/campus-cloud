export const emptyForm = {
  city: null,
  name: null,
  phone: null,
  email: null,
  latitude: 0,
  longitude: 0,
  country: null,
  address: null,
  province: null,
  image_url: null,
  short_name: null,
  description: null,
  postal_code: null,
  category_id: null,
  links: [
    {
      url: null,
      label: null
    }
  ],
  schedule: []
};

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
    image_url: 'thumb.jpeg',
    address: 'Clifton Block #04',
    email: 'test@oohlalamobile.com',
    description: 'test description',
    links: [{ url: null, label: null }],
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
    image_url: 'thumb.jpeg',
    address: 'Clifton Block #04',
    email: 'test@oohlalamobile.com',
    description: 'test description',
    links: [{ url: null, label: null }],
    schedule: []
  }
];
