export interface IExternalAppOpenLinkParams {
  android: { fallback_http_url: string; package_name: string };
  ios: { fallback_http_url: string; app_link: string };
}

export interface IExternalAppOpenFormDetails {
  link_type: number;
  link_url: string;
  link_params: IExternalAppOpenLinkParams;
}
