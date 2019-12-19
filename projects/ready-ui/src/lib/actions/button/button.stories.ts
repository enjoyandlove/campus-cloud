import { storiesOf, moduleMetadata } from '@storybook/angular';
import { centered } from '@storybook/addon-centered/angular';
import { select, text } from '@storybook/addon-knobs';

import { ButtonModule } from './button.module';

const variants = {
  Flat: 'flat',
  Basic: 'basic',
  Inline: 'inline',
  Stroked: 'stroked'
};

const color = {
  White: 'white',
  Danger: 'danger',
  Primary: 'primary',
  Warning: 'warning',
  Default: 'default'
};

const disabled = {
  True: 'disabled',
  False: null
};

storiesOf('Button', module)
  .addDecorator(
    moduleMetadata({
      imports: [ButtonModule]
    })
  )
  .addDecorator(centered)
  .add(
    'Default',
    () => {
      return {
        props: {
          text: text('Button Text', 'Hello'),
          color: select('Color', color, 'primary'),
          variant: select('Variant', variants, 'flat'),
          disabled: select('Disabled', disabled, null)
        },
        template: `
        <button
          ui-button
          type="button"
          [color]="color"
          [variant]="variant"
          [disabled]="disabled"
          type="button">{{text}}</button>`
      };
    },
    {
      notes: require('./README.md')
    }
  );
