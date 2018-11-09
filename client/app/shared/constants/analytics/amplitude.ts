const amplitudeEventTypes = {
  PAGE_VIEW: 'page_view',

  BUTTON_CLICK: 'button_click'
};

export const cpTrackAmplitude = {
  type: { ...amplitudeEventTypes }
};

export const amplitudeEvents = {
  NO: 'No',

  YES: 'Yes',

  NEW: 'New',

  WEB: 'Web',

  WALL: 'Wall',

  POST: 'Post',

  CLUB: 'Club',

  INFO: 'Info',

  USER: 'User',

  LIST: 'List',

  STORE: 'Store',

  EVENT: 'Event',

  TODOS: 'To-Dos',

  MOBILE: 'Mobile',

  EVENTS: 'Events',

  MEMBER: 'Member',

  ACTIVE: 'Active',

  COMMENT: 'Comment',

  REGULAR: 'Regular',

  SERVICE: 'Service',

  PENDING: 'Pending',

  ENABLED: 'Enabled',

  REQUIRED: 'Required',

  EXISTING: 'Existing',

  EMPLOYER: 'Employer',

  SERVICES: 'Services',

  TEMPLATE: 'Template',

  NO_LOGIN: 'No Login',

  OPTIONAL: 'Optional',

  DISABLED: 'Disabled',

  MENU_MANAGE: 'Manage',

  MENU_ASSESS: 'Assess',

  MENU_STUDIO: 'Studio',

  MENU_NOTIFY: 'Notify',

  EXECUTIVE: 'Executive',

  INFO_PAGE: 'Info Page',

  EXPERIENCE: 'Experience',

  ATHLETICS: 'Athletics',

  NO_ACCESS: 'No Access',

  LOGGED_IN: 'Logged In',

  ATTENDANCE: 'Attendance',

  PAST_EVENT: 'Past Event',

  CLUB_EVENT: 'Club Event',

  LOGGED_OUT: 'Logged Out',

  ASSESSMENT: 'Assessment',

  MENU_AUDIENCE: 'Audience',

  CAMPUS_WIDE: 'Campus Wide',

  ORIENTATION: 'Orientation',

  ONE_SERVICE: 'One Service',

  FULL_ACCESS: 'Full Access',

  VIEWED_ITEM: 'Viewed Item',

  ALL_STUDENTS: 'All Students',

  DELETED_ITEM: 'Deleted Item',

  ANNOUNCEMENT: 'Announcement',

  CAROUSEL_WHEEL: 'Carousel Wheel',

  SELECT_ACCESS: 'Select Access',

  NO_ENGAGEMENT: 'No Engagement',

  SERVICE_EVENT: 'Service Event',

  ATHLETIC_EVENT: 'Athletic Event',

  CUSTOM_AUDIENCE: 'Custom Audience',

  UPLOADED_PHOTO: 'Uploaded Photo',

  CREATED_ACCOUNT: 'Created Account',

  UPCOMING_EVENT: 'Upcomping Event',

  CALENDAR_EVENTS: 'Calendar Events',

  RESET_PASSWORD: 'Reset Password',

  ONE_ENGAGEMENT: 'One Engagement',

  SINGLE_STUDENT: 'Single Student',

  ALL_ENGAGEMENT: 'All Engagement',

  CHANGED_SCHOOL: 'Changed School',

  LOADED_CHECK_IN: 'Loaded Check-In',

  CLICKED_CHECK_IN: 'Clicked Check-In',

  DYNAMIC_AUDIENCE: 'Dynamic Audience',

  CLICKED_MENU: 'Clicked Menu Item',

  SERVICE_PROVIDER: 'Service Provider',

  EVENT_ASSESSMENT: 'Event Assessment',

  CHANGE_PASSWORD: 'Changed Password',

  WALL_MOVED_POST: 'Wall - Moved Post',

  CLICKED_PAGE_ITEM: 'Clicked Page Item',

  VISITED_HELP_DESK: 'Visited Help Desk',

  ORIENTATION_EVENT: 'Orientation Event',

  INSTITUTION_EVENT: 'Institution Event',

  MANAGE_CHECKED_IN: 'Manage - Checked In',

  MANAGE_CHECKED_OUT: 'Manage - Checked Out',

  WALL_DELETED_POST: 'Wall - Deleted Post',

  CLICKED_CREATE_ITEM: 'Clicked Create Item',

  CREATE_ACCOUNT_PAGE: 'Create Account Page',

  CLICKED_SUB_MENU: 'Clicked Sub-Menu Item',

  INVITED_TEAM_MEMBER: 'Invited Team Member',

  WALL_APPROVED_POST: 'Wall - Approved Post',

  WALL_CLICKED_IMAGE: 'Wall - Clicked Image',

  MULTIPLE_ENGAGEMENT: 'Multiple Engagement',

  UPDATED_TEAM_MEMBER: 'Updated Team Member',

  DELETED_TEAM_MEMBER: 'Deleted Team Member',

  WALL_VIEWED_COMMENT: 'Wall - Viewed Comment',

  ORIENTATION_PROGRAMS: 'Orientation Programs',

  WALL_SUBMITTED_POST: 'Wall - Submitted Post',

  MANAGE_CREATED_LINK: 'Manage - Created Link',

  MANAGE_UPDATED_LINK: 'Manage - Updated Link',

  MULTIPLE_ENGAGEMENTS: 'Multiple Engagements',

  MANAGE_CREATED_CLUB: 'Manage - Created Club',

  ASSESS_VIEWED_CARDS: 'Assess - Viewed Cards',

  MANAGE_UPDATED_CLUB: 'Manage - Updated Club',

  MANAGE_APPROVED_CLUB: 'Manage - Approved Club',

  WALL_DELETED_COMMENT: 'Wall - Deleted Comment',

  MANAGE_UPDATED_EVENT: 'Manage - Updated Event',

  MANAGE_CREATED_EVENT: 'Manage - Created Event',

  ASSESS_DOWNLOAD_DATA: 'Assess Downloaded Data',

  WALL_UPDATED_SETTINGS: 'Wall - Updated Settings',

  CUSTOMIZE_SAVED_PHOTO: 'Customize - Saved Photo',

  MANAGE_ADDED_CHECK_IN: 'Manage - Added Check-In',

  MANAGE_DOWNLOAD_DATA: 'Manage - Downloaded Data',

  MANAGE_CHANGED_QR_CODE: 'Manage - Changed QR Code',

  MANAGE_CANCELED_EVENT: 'Manage - Cancelled Event',

  NOTIFY_DELETED_LISTING: 'Notify - Deleted Listing',

  WALL_SUBMITTED_COMMENT: 'Wall - Submitted Comment',

  MANAGE_UPDATED_CHECK_IN: 'Manage - Updated Check-In',

  NOTIFY_CREATED_TEMPLATE: 'Notify - Created Template',

  MANAGE_SENT_ANNOUNCEMENT: 'Menage - Sent Announcement',

  ASSESS_SENT_ANNOUNCEMENT: 'Assess - Sent Announcement',

  MANAGE_CREATED_SERVICE: 'Manage - Created Service',

  MANAGE_UPDATED_SERVICE: 'Manage - Updated Service',

  MANAGE_CREATED_LOCATION: 'Manage - Created Location',

  MANAGE_CREATED_CALENDAR: 'Manage - Created Calendar',

  MANAGE_UPDATED_LOCATION: 'Manage - Updated Location',

  STUDIO_MOVED_EXPERIENCE: 'Studio - Moved Experience',

  MANAGE_ADDED_CLUB_MEMBER: 'Manage - Added Club Member',

  CUSTOMIZE_CANCELED_PHOTO: 'Customize - Canceled Photo',

  NOTIFY_SEND_ANNOUNCEMENT: 'Notify - Send Announcement',

  STUDIO_CREATED_EXPERIENCE: 'Studio - Created Experience',

  STUDIO_UPDATED_EXPERIENCE: 'Studio - Updated Experience',

  STUDIO_DELETED_EXPERIENCE: 'Studio - Deleted Experience',

  MANAGE_DOWNLOADED_QR_CODE: 'Manage - Downloaded QR Code',

  MANAGE_UPDATED_CLUB_MEMBER: 'Manage - Updated Club Member',

  MANAGE_LOADED_WEB_CHECK_IN: 'Manage - Loaded Web Check-In',

  MANAGE_CLICKED_WEB_CHECK_IN: 'Manage - Clicked Web Check-In',

  MANAGE_UPDATED_CALENDAR_EVENT: 'Manage - Updated Calendar Event',

  MANAGE_CREATED_CALENDAR_EVENT: 'Manage - Created Calendar Event',

  MANAGE_VIEWED_SERVICE_PROVIDER: 'Manage - Viewed Service Provider',

  MANAGE_CREATED_SERVICE_PROVIDER: 'Manage - Created Service Provider',

  STUDIO_VIEWED_CUSTOMIZATION_EXPERIENCE: 'Studio -  Viewed App Customization'
};
