import { text, select, number, boolean } from '@storybook/addon-knobs';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { centered } from '@storybook/addon-centered/angular';
import { ReadyUiModule } from '@ready-education/ready-ui';

import readme from './README.md';

const placement = {
  Top: 'top',
  Left: 'left',
  Right: 'right',
  Bottom: 'bottom'
};

storiesOf('Overlays/Tooltip', module)
  .addDecorator(
    moduleMetadata({
      imports: [ReadyUiModule]
    })
  )
  .addDecorator(centered)
  .add(
    'Tooltip',
    () => {
      return {
        props: {
          // offset: number('Offset', 5),
          // delay: number('Delay', 200),
          title: text('Tooltip Text', 'Hello World'),
          template: boolean('Custom Template', false),
          placement: select('Placement', placement, 'bottom')
        },
        template: `
        <button
          ui-button
          ui-tooltip
          type="button"
          [title]="title"
          [placement]="placement"
          [template]="template ? customTemplate : undefined">Tooltip</button>
        <ng-template #customTemplate>
          <div class="custom">
            <img src="https://placehold.it/300x200" style="max-width: 100%" />
            <h3>Important</h3>
            <p>Options can be passed via data attributes or JavaScript. <a href="#" style="color: blue">Learn More</a></p>
          </div>
        </ng-template>
      `
      };
    },
    { notes: readme }
  );
