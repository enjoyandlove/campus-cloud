import { ITheme } from './../interfaces/theme.interface';

export const defaultTheme: ITheme = {
  name: 'default_theme',
  properties: {
    '--color-primary': '#2dc7ff',
    '--color-secondary': '#0072bb',
    '--color-success': '#5cb85c',
    '--color-danger': '#d9534f',
    '--color-info': '#0275d8',
    '--color-warning': '#f0ad4e',
    '--color-grey-0': '#0a0908', // black
    '--color-grey-50': '#6f7071',
    '--color-grey-100': '#aeafb1',
    '--color-grey-150': '#eff0f2',
    '--color-grey-200': '#ddd',
    '--color-grey-255': '#fefefe', // white
    '--setting-border-radius': '0px'
  }
};
