import { withKnobs, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { UiModule } from 'libraries/ui/src/public_api';
import { UI_THEME } from 'libraries/ui/src/lib/theme-provider/tokens';
import { defaultTheme } from 'libraries/ui/src/lib/theme-provider/themes/default.theme';

const stories = storiesOf('[UI] Button', module);
stories.addDecorator(withKnobs);

const colorOptions = {
  Default: null,
  Primary: 'primary',
  Secondary: 'secondary',
  Danger: 'danger',
  Success: 'success'
};

stories
  .add('Default', () => ({
    moduleMetadata: {
      declarations: [],
      imports: [UiModule],
      providers: [{ provide: UI_THEME, useValue: defaultTheme }]
    },
    props: {
      color: select('Color', colorOptions, 'primary'),
      disabled: select('Disabled', { True: true, False: null }, null)
    },
    template: `
    <ready-ui-theme-provider>
      <button uiButton [color]='color' [attr.disabled]="disabled">Button</button>
    </ready-ui-theme-provider>`
  }))
  .add('Raised', () => ({
    moduleMetadata: {
      declarations: [],
      imports: [UiModule],
      providers: [{ provide: UI_THEME, useValue: defaultTheme }]
    },
    props: {
      color: select('Color', colorOptions, 'primary'),
      disabled: select('Disabled', { True: true, False: null }, null)
    },
    template: `
    <ready-ui-theme-provider>
      <button uiButton raised [color]='color' [attr.disabled]="disabled">Button</button>
    </ready-ui-theme-provider>`
  }))
  .add('Stroked', () => ({
    moduleMetadata: {
      declarations: [],
      imports: [UiModule],
      providers: [{ provide: UI_THEME, useValue: defaultTheme }]
    },
    props: {
      color: select('Color', colorOptions, 'primary'),
      disabled: select('Disabled', { True: true, False: null }, null)
    },
    template: `
    <ready-ui-theme-provider>
      <button uiButton stroked [color]='color' [attr.disabled]="disabled">Button</button>
    </ready-ui-theme-provider>`
  }))
  .add('Transparent', () => ({
    moduleMetadata: {
      declarations: [],
      imports: [UiModule],
      providers: [{ provide: UI_THEME, useValue: defaultTheme }]
    },
    props: {
      color: select('Color', colorOptions, 'primary'),
      disabled: select('Disabled', { True: true, False: null }, null)
    },
    template: `
    <ready-ui-theme-provider>
      <button uiButton [color]='color' transparent [attr.disabled]="disabled">Button</button>
    </ready-ui-theme-provider>`
  }));
