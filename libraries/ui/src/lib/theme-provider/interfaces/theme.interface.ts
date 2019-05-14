interface IThemeProperty {
  [key: string]: string;
}

export interface ITheme {
  name: string;
  properties: IThemeProperty;
}
