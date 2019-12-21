import { storiesOf, moduleMetadata } from '@storybook/angular';
import { select, text, boolean } from '@storybook/addon-knobs';
import { ImageModule } from '@ready-education/ready-ui';
import { CommonModule } from '@angular/common';

const sizes = {
  Regular: 'regular',
  Small: 'small',
  Big: 'big'
};

storiesOf('Image', module)
  .addDecorator(
    moduleMetadata({
      imports: [CommonModule, ImageModule]
    })
  )
  .add(
    'Avatar',
    () => {
      return {
        props: {
          round: boolean('Round', false),
          size: select('Size', sizes, 'regular')
        },
        template: `
          <ready-ui-avatar
            [size]="size"
            [round]="round"
            alt="A long ALT text here"
            src="https://placehold.it/300x230"></ready-ui-avatar>
        `
      };
    },
    {
      notes: require('./avatar/README.md')
    }
  );
