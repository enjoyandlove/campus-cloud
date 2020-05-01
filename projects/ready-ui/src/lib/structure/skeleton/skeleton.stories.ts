import { storiesOf, moduleMetadata } from '@storybook/angular';
import { centered } from '@storybook/addon-centered/angular';

import { SkeletonModule } from '@ready-education/ready-ui/structure';

storiesOf('Structure/Skeleton', module)
  .addDecorator(
    moduleMetadata({
      imports: [SkeletonModule]
    })
  )
  .addDecorator(centered)
  .add('text', () => {
    return {
      template: '<ready-ui-skeleton-text></ready-ui-skeleton-text>'
    };
  });
