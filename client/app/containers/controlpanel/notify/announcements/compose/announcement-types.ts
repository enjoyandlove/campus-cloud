export const types = [
  {
    action: 2,
    label: 'Regular',
    description: 'Delivered as a regular push notification'
  },
  {
    action: 1,
    label: 'Urgent',
    description: 'Overrides the push settings of the user'
  },
  {
    action: 0,
    label: 'Emergency',
    description: 'Overrides the push settings of the user and forces users to \
    acknowledge the message'
  }
];
