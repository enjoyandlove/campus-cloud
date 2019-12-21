import { storiesOf, moduleMetadata } from '@storybook/angular';
import { centered } from '@storybook/addon-centered/angular';
import { IconsModule } from '@ready-education/ready-ui';
import { select, text } from '@storybook/addon-knobs';

const sizes = {
  Small: 'small',
  Regular: 'regular'
};

storiesOf('Icons', module)
  .addDecorator(
    moduleMetadata({
      imports: [IconsModule]
    })
  )
  .addDecorator(centered)
  .add(
    'Icons',
    () => {
      return {
        props: {
          color: text('Color', '0d0d0d'),
          name: text('Material icon name', 'cloud_upload'),
          size: select('Size', sizes, 'regular')
        },
        template: `
          <ready-ui-symbol></ready-ui-symbol>
          <ready-ui-icon [color]="color" [name]="name" [size]="size"></ready-ui-icon>
        `
      };
    },
    {
      notes: require('./icon/README.md')
    }
  );
