import { storiesOf, moduleMetadata } from '@storybook/angular';

import { GalleryModule } from '@ready-education/ready-ui/forms';
import { ImagesAndIconsModule } from '@ready-education/ready-ui/images-and-icons/images-and-icons.module';

const images = [
  'https://source.unsplash.com/random/120x90/?city',
  'https://source.unsplash.com/random/120x90/?people',
  'https://source.unsplash.com/random/120x90/?nature'
];

storiesOf('Form/Gallery', module)
  .addDecorator(
    moduleMetadata({
      imports: [GalleryModule, ImagesAndIconsModule]
    })
  )
  .add('styles', () => {
    return {
      props: {
        images,
        removeImage: (index: number) => {
          images.splice(index, 1);
        },
        validateSize: (file: File)  => {
          /* this business logic was defined before on ready-ui-gallery-add-item */
          return file.size <= 5e6;
        },
        addImage: (files: File[]) => {
          files = Array.from(files).filter((file: File) =>
            this.validateSize(file) ? file : this.errorHandler({file: file})
          );

          if (!files.length) {
            return;
          }

          const _images = files.map((file) => URL.createObjectURL(file));

          images.push(..._images);
        },
        errorHandler: ({ file }) => alert(`File too big ${file.name}`)
      },
      template: `
      <ready-ui-symbol></ready-ui-symbol>
      <ready-ui-gallery-group>
        <ready-ui-gallery-item
          [src]="image"
          (close)="removeImage(index)"
          *ngFor="let image of images; index as index">
        </ready-ui-gallery-item>
        <ready-ui-gallery-add-item
          (add)="addImage($event)">
        </ready-ui-gallery-add-item>
      </ready-ui-gallery-group>`
    };
  });
