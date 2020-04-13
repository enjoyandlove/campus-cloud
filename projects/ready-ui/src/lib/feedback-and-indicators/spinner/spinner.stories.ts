import { storiesOf, moduleMetadata } from '@storybook/angular';
import { select, text, boolean } from '@storybook/addon-knobs';
import { ReadyUiModule } from '@ready-education/ready-ui';

import readme from './spinner/README.md';

const sizes = {
  Regular: 'regular',
  Small: 'small'
};

storiesOf('Feedback and Indicators/Spinner', module)
  .addDecorator(
    moduleMetadata({
      imports: [ReadyUiModule]
    })
  )
  .add(
    'Spinner',
    () => {
      return {
        props: {
          centered: boolean('Centered', true),
          size: select('Size', sizes, 'regular'),
          color: text('Background Color', '#2c94e9')
        },
        template: `
          <ready-ui-spinner
            [size]="size"
            [color]="color"
            [centered]="centered"></ready-ui-spinner>`
      };
    },
    {
      notes: readme
    }
  );
