export const statusTypes = [
  {
    action: 1,
    label: 'Active',
    description: 'Club will be visible on the Campus App and the Campus Cloud<br>'
  },
  {
    action: 0,
    label: 'Inactive',
    description: 'Club will be hidden on the Campus App but visible on the Campus Cloud'
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



