import { storiesOf, moduleMetadata } from '@storybook/angular';
import { boolean } from '@storybook/addon-knobs';
import { CommonModule } from '@angular/common';

import { GalleryModule } from '@ready-education/ready-ui/forms';
import { LightboxModule } from '@ready-education/ready-ui/overlays';
import { ImagesAndIconsModule } from '@ready-education/ready-ui/images-and-icons/images-and-icons.module';

storiesOf('Overlays/Lightbox', module)
  .addDecorator(
    moduleMetadata({
      imports: [LightboxModule, CommonModule, GalleryModule, ImagesAndIconsModule]
    })
  )
  .add('styles', () => {
    const withRandomDimensions = boolean('Random Dimensions', false);

    const randomDimension = () => {
      if (!withRandomDimensions) {
        return '1200x900';
      }
      const randomDigit = Math.floor(Math.random() * 1000).toFixed();
      const randomDigit2 = Math.floor(Math.random() * 1000).toFixed();
      return `${randomDigit}x${randomDigit2}`;
    };
    let collection = [
      `https://source.unsplash.com/random/${randomDimension()}/?city`,
      `https://source.unsplash.com/random/${randomDimension()}/?people`,
      `https://source.unsplash.com/random/${randomDimension()}/?nature`,
      `https://source.unsplash.com/random/${randomDimension()}/?education`
    ];

    collection = collection.filter((item, index) => index + 1 <= 4);

    return {
      styles: [
        `
        .story-container {
          width: 655px;
          height: 240px;
          display: flex;
          flex-wrap: wrap;
          overflow: hidden;
          border-radius: 18px;
          flex-direction: column;
        }

        .story-container__item {
          width: 50%;
          height: 120px;
          box-sizing: border-box;
        }

        .story-container__item.full-height {
          height: 240px;
        }

        .story-container__item.full-width {
          width: 100%;
        }

        .story-container__item img {
          object-fit: cover;
          width: calc(100% - 2px);
          height: calc(100% - 2px);
        }
      `
      ],
      props: {
        images: collection
      },
      template: `
      <ready-ui-symbol></ready-ui-symbol>
      <div class="story-container" ready-ui-lightbox>
        <div
          class="story-container__item"
          *ngFor="let image of images; index as index"
          [ngClass]="{
            'full-width': images.length === 1,
            'full-height': images.length < 3 || images.length < 4 && index === 0
          }">
          <img [src]="image" ready-ui-lighbox-item/>
        </div>
      </div>
      `
    };
  });
