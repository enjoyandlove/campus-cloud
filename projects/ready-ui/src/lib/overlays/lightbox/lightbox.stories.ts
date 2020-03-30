import { storiesOf, moduleMetadata } from '@storybook/angular';
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
    const randomDimension = () => {
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
          border-radius: 8px;
          justify-content: space-between;
        }

        .story-container--row {
          flex-direction: row;
        }

        .story-container--column {
          flex-direction: column;
        }

        .story-container--column .story-container__item {
          width: 50%;
        }

        .story-container__item {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .story-container__item img {
          width: 100%;
          height: 120px;
          object-fit: cover;
        }

        .story-container__item img.full-height {
          height: 240px;
        }
      `
      ],
      props: {
        images: collection
      },
      template: `
      <ready-ui-symbol></ready-ui-symbol>
      <div class="story-container" [ngClass]="images.length > 2 ? 'story-container--column' : 'story-container--row'" ready-ui-lightbox>
        <div class="story-container__item" *ngFor="let image of images; index as index">
          <img [src]="image" [ngClass]="{
            'full-height': images.length < 3 || images.length < 4 && index === 0
          }" ready-ui-lighbox-item/>
        </div>
      </div>
      `
    };
  });
