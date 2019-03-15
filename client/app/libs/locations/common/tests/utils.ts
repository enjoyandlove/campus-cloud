export const filledForm = {
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
  description: 'test description',
  email: 'test@oohlalamobile.com'
};

export const mockLinksData = [
  {
    url: '',
    label: 'Menu'
  }
];

export function mockScheduleData() {
  const days = Array.from(Array(7).keys());
  const schedule = [];

  days.forEach((day) => {
    schedule.push({
      day: day + 1,
      is_checked: false,
      items: [
        {
          name: '',
          end_time: 61200,
          start_time: 32400
        }
      ]
    });
  });

  return schedule;
}
