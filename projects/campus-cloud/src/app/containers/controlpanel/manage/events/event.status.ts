export enum AttendeeType {
  'active' = 1,
  'external' = 0,
  'deleted' = -1
}

export enum EventAttendance {
  'enabled' = 1,
  'disabled' = 0
}

export enum EventFeedback {
  'enabled' = 1,
  'disabled' = 0
}

export enum EventSort {
  'title' = 'title',
  'start' = 'start',
  'end' = 'end'
}

export enum EventSortDirection {
  'asc' = 'asc',
  'desc' = 'desc'
}

export enum Assessment {
  'on' = 'On',
  'off' = 'Off'
}

export enum Location {
  'yes' = 'Yes',
  'no' = 'No'
}

export enum UploadedPhoto {
  'yes' = 'Yes',
  'no' = 'No'
}

export enum Feedback {
  'enabled' = 'Enabled',
  'disabled' = 'Disabled'
}

export enum CheckInOut {
  'no' = 'No',
  'yes' = 'Yes'
}

export enum CheckInMethod {
  'web' = 1,
  'webQr' = 2,
  'app' = 3,
  'deepLink' = 5,
  'userWebEntry' = 6
}

export enum SelfCheckInOption {
  qr = 0,
  email = 1
}

export enum CheckInOutTime {
  'empty' = -1
}

export enum EventType {
  'event' = 0,
  'club' = 1,
  'services' = 2,
  'athletics' = 3,
  'orientation' = 4
}

export enum EventCategory {
  'club' = 0,
  'athletics' = 16,
  'services' = 19
}

export const qrCode = {
  enabled: true,
  disabled: false
};

export const isAllDay = {
  enabled: true,
  disabled: false
};

export const attendanceType = {
  checkInOnly: false,
  checkInCheckOut: true
};
