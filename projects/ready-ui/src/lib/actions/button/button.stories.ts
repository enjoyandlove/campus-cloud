import { ButtonModule, IconsModule } from '@ready-education/ready-ui';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { centered } from '@storybook/addon-centered/angular';
import { select, text } from '@storybook/addon-knobs';

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
      imports: [ButtonModule, IconsModule]
    })
  )
  .addDecorator(centered)
  .add(
    'Button',
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
  )
  .add('Button with icon', () => {
    return {
      styles: [
        `
      ready-ui-icon {
        margin-left: 0.2em;
      }
      `
      ],
      template: `
        <ready-ui-symbol></ready-ui-symbol>
        <button
          ui-button
          type="button"
          color="primary"
          variant="flat"
          type="button">Like <ready-ui-icon name="thumb_up" color="fff" size="small"></ready-ui-icon></button>`
    };
  });
