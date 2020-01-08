import { storiesOf, moduleMetadata } from '@storybook/angular';
import { centered } from '@storybook/addon-centered/angular';
import { text, select } from '@storybook/addon-knobs';
import { TextModule } from '@ready-education/ready-ui';

const variants = {
  None: '',
  Bold: 'bold',
  Caption: 'caption'
};

const color = {
  None: '',
  Info: 'info',
  Muted: 'muted',
  Danger: 'danger',
  Success: 'success'
};

storiesOf('Text', module)
  .addDecorator(
    moduleMetadata({
      imports: [TextModule]
    })
  )
  .addDecorator(centered)
  .add(
    'Styles',
    () => {
      return {
        props: {
          text: text('Text', 'Text'),
          colors: select('Color', color, ''),
          variants: select('Variant', variants, '')
        },
        template: `
          <p ui-text-style [variant]="variants" [color]="colors">{{text}}</p>
        `
      };
    },
    {
      notes: require('./README.md')
    }
  );
