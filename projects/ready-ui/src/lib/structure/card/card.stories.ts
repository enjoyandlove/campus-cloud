import { storiesOf, moduleMetadata } from '@storybook/angular';
import { centered } from '@storybook/addon-centered/angular';
import { ReadyUiModule } from '@ready-education/ready-ui';
import { select, text } from '@storybook/addon-knobs';

const spacing = {
  Loose: 'loose',
  Tight: 'tight',
  Regular: 'regular'
};

const shadows = {
  Dark: 'dark',
  Light: 'light',
  Regular: 'regular'
};

storiesOf('Card', module)
  .addDecorator(
    moduleMetadata({
      imports: [ReadyUiModule]
    })
  )
  .addDecorator(centered)
  .add(
    'Card',
    () => {
      return {
        props: {
          title: text('Title', 'Calendar'),
          shadow: select('Shadow', shadows, 'regular'),
          spacing: select('Spacing', spacing, 'regular')
        },
        template: `
          <ready-ui-card [title]="title" [spacing]="spacing" [shadow]="shadow">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse voluptates culpa iusto sed eligendi soluta tempore
          </ready-ui-card>
        `
      };
    },
    {
      notes: require('./card/README.md')
    }
  );
