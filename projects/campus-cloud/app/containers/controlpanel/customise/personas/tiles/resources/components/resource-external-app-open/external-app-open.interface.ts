export interface IExternalAppOpenLinkParams {
  android: { store_url: string; package_name: string };
  ios: { store_url: string; http_url: string };
}

export interface IExternalAppOpenFormDetails {
  link_type: number;
  link_url: string;
  link_params: IExternalAppOpenLinkParams;
}
