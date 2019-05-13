import { withKnobs, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { UiModule } from 'libraries/ui/src/public_api';
import { UI_THEME } from 'libraries/ui/src/lib/theme-provider/tokens';
import { defaultTheme } from 'libraries/ui/src/lib/theme-provider/themes/default.theme';

const stories = storiesOf('[UI] Group', module);
stories.addDecorator(withKnobs);

const alignOptions = {
  Default: null,
  Right: 'right',
  Left: 'left',
  Center: 'center',
  Between: 'between'
};

stories.add('Default', () => ({
  moduleMetadata: {
    declarations: [],
    imports: [UiModule],
    providers: [{ provide: UI_THEME, useValue: defaultTheme }]
  },
  styles: [`.box {width: 180px; height: 100px; background: red; border: 1px solid white}`],
  props: {
    align: select('Align', alignOptions, 'left'),
    direction: select('Direction', { Block: 'block', Inline: 'inline' }, 'inline')
  },
  template: `
    <ready-ui-group [direction]="direction" [align]="align">
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
    </ready-ui-group>`
}));
