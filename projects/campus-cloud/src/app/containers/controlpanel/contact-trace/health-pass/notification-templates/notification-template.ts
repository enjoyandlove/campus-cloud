export interface INotificationTemplate {
  type: number;
  name: string;
  subject: string;
  message: string;
}

export enum NotificationTemplateType {
  Clear = 1,
  Exposed = 2,
  Symptomatic = 3,
  Self_Reported = 4,
  Confirmed = 5
}
