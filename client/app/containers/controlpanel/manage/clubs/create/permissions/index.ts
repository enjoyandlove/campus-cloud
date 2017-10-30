import { ClubStatus } from '../../club.status';

export const statusTypes = [
  {
    action: ClubStatus.active,
    label: 'Active',
    description: 'Club is approved and will be listed on the Campus App'
  },
  {
    action: ClubStatus.inactive,
    label: 'Inactive',
    description: 'Club is suspended and will not be listed on the Campus App'
  },
  {
    action: ClubStatus.pending,
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



