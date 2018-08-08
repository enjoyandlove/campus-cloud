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

export enum CheckInMethod {
  'web' = 1,
  'web-qr' = 2,
  'app' = 3
}

export enum QRCode {
  'active' = 1,
  'inActive' = 0
}

export enum AttendanceType {
  'checkInOnly' = 0,
  'checkInCheckOut' = 1
}

export const isAllDay = {
  enabled: true,
  disabled: false
};
