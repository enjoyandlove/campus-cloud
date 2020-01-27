import { storiesOf, moduleMetadata } from '@storybook/angular';
import { select, text, boolean, number } from '@storybook/addon-knobs';
import { ReadyUiModule } from '@ready-education/ready-ui';
import { CommonModule } from '@angular/common';

const sizes = {
  Regular: 'regular',
  Small: 'small',
  Big: 'big'
};

const defaultImage = 'https://placehold.it/300x230';

storiesOf('Image', module)
  .addDecorator(
    moduleMetadata({
      imports: [CommonModule, ReadyUiModule]
    })
  )
  .add(
    'Avatar',
    () => {
      return {
        props: {
          round: boolean('Round', false),
          size: select('Size', sizes, 'regular'),
          imgUrl: text('Image Url', defaultImage)
        },
        template: `
          <ready-ui-avatar
            [size]="size"
            [round]="round"
            alt="A long ALT text here"
            [src]="imgUrl"></ready-ui-avatar>
        `
      };
    },
    {
      notes: require('./avatar/README.md')
    }
  )
  .add('Lazy loading multiple images', () => {
    const topics = [
      'nature',
      'water',
      'cities',
      'people',
      'portait',
      'food',
      'sports',
      'football',
      'travel',
      'tennis',
      'forest',
      'winter',
      'landscape',
      'beach',
      'office'
    ];
    return {
      props: {
        topics,
        defaultImage
      },
      styles: [
        `
        .wrapper {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .scrollable {
          width: 50vw;
          height: 20em;
          overflow-x: scroll;
        }

        ready-ui-avatar {
          display: block;
        }

        ready-ui-avatar:not(:last-child) {
          margin-bottom: 2em;
        }
      `
      ],
      template: `
        <div class="wrapper">
          <div class="scrollable">
            <ready-ui-avatar
              [size]="size"
              [round]="round"
              alt="A long ALT text here"
              *ngFor="let topic of topics"
              [src]="['https://source.unsplash.com/random/800x320?' + topic]"></ready-ui-avatar>
          </div>
        </div>
      `
    };
  });
