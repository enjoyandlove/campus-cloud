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

export enum CheckOut {
  'no' = 'No',
  'yes' = 'Yes'
}

export enum CheckInMethod {
  'web' = 1,
  'webQr' = 2,
  'app' = 3
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

export enum CheckInSource {
  'club' = 'club',
  'events' = 'events',
  'services' = 'services',
  'athletics' = 'athletics',
  'orientation' = 'orientation'
}

export const qrCode = {
  'enabled': true,
  'disabled': false
};

export const isAllDay = {
  enabled: true,
  disabled: false
};

export const attendanceType = {
  'checkInOnly': false,
  'checkInCheckOut': true
};
