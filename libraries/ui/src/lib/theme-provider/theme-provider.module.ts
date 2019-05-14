import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UI_THEME } from './tokens';
import { ThemeProviderComponent } from './components';
import { ITheme } from './interfaces/theme.interface';
import { defaultTheme } from './themes/default.theme';

@NgModule({
  declarations: [ThemeProviderComponent],
  exports: [ThemeProviderComponent],
  imports: [CommonModule]
})
export class ThemeProviderModule {
  static forRoot(theme: ITheme): ModuleWithProviders {
    return {
      ngModule: ThemeProviderModule,
      providers: [
        {
          provide: UI_THEME,
          useValue: {
            name: theme.name,
            properties: {
              ...defaultTheme.properties,
              ...theme.properties
            }
          }
        }
      ]
    };
  }
}
