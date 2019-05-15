export interface IExternalAppOpenLinkParams {
  android: { store_url: string; package_name: string };
  ios: { store_url: string; http_url: string };
}

export interface IExternalAppOpenFormDetails {
  link_type: number;
  meta: {
    is_system: number;
    link_params: IExternalAppOpenLinkParams;
    open_in_browser: number;
    link_url: string;
  };
}
