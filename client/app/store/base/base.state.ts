export interface IAlert {
  body: string;
  class: string;
  isShow: boolean;
}

export interface IAudience {
  audience_id: number;
  new_audience_active: boolean;
  saved_audience_active: boolean;
}

export interface IHeader {
  heading: string;
  subheading?: string;
  em?: string;
  crumbs?: {
    url: string;
    label: string;
  };
  children: { url: string; label: string }[];
}

export interface ISnackbar {
  body: string;
  class: string;
  sticky?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export interface IBaseState {
  CLUBS: any;
  ALERT: IAlert;
  HEADER: IHeader;
  SNACKBAR: ISnackbar;
  AUDIENCE: IAudience;
  EVENTS_MODAL: any;
  SERVICES_MODAL: any;
}
