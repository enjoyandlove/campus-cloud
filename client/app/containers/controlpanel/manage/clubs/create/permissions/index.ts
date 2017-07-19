export const statusTypes = [
  {
    action: 1,
    label: 'Active',
    description: 'Club is approved and will be listed on the Campus App'
  },
  {
    action: 0,
    label: 'Inactive',
    description: 'Club is suspended and will be listed on the Campus App'
  },
  {
    action: 2,
    label: 'Pending',
    description: 'Club is awating approval and will not be listed on the Campus App'
  }
];

export const membershipTypes = [
  {
    action: true,
    label: 'Enabled',
    description: 'Allows users to join the club and message other members'
  },
  {
    action: false,
    label: 'Disabled',
    description: 'Users can view the club but cannot join or message other members'
  }
];



