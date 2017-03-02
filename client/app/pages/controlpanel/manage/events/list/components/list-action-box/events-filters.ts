export const DATE_FILTER = [
  {
    'label': 'Upcoming Event',
    'action': true
  },
  {
    'label': 'Past Event',
    'action': false
  }
];

export const BUTTON_DROPDOWN = {
  'button': {
    'label': 'Create Event',
    'url': '/manage/events/create'
  },
  'children': [
    {
      'label': 'Import Events from Facebook',
      'event': 'facebook'
    },
    {
      'label': 'Import Events from Excel',
      'event': 'excel'
    }
  ]
};
