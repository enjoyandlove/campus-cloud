import { storiesOf } from '@storybook/angular';

import { UiModule } from 'libraries/ui/src/public_api';
import { UI_THEME } from 'libraries/ui/src/lib/theme-provider/tokens';
import { defaultTheme } from 'libraries/ui/src/lib/theme-provider/themes/default.theme';

storiesOf('[UI] Navigation', module).add('Default', () => ({
  moduleMetadata: {
    declarations: [],
    imports: [UiModule],
    providers: [{ provide: UI_THEME, useValue: defaultTheme }]
  },
  styles: [],
  template: `
    <ready-ui-theme-provider>
      <ready-ui-navigation>
        <ready-ui-navigation-brand>
          <img src="https://placehold.it/40x40" />
          Brand
        </ready-ui-navigation-brand>
        <ready-ui-navigation-item><a href="#">Item One</a></ready-ui-navigation-item>
        <ready-ui-navigation-item>Item Two</ready-ui-navigation-item>
        <ready-ui-navigation-item>Item Three</ready-ui-navigation-item>
      </ready-ui-navigation>
    </ready-ui-theme-provider>`
}));
