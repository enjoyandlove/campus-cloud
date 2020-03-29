import { storiesOf, moduleMetadata } from '@storybook/angular';
import { ReadyUiModule } from '@ready-education/ready-ui';
import { select } from '@storybook/addon-knobs';

import readme from './stack/README.md';

const directions = {
  Horizontal: 'horizontal',
  Vertical: 'vertical'
};

const alignment = {
  Start: 'start',
  End: 'end',
  Center: 'center',
  Even: 'even',
  Between: 'between'
};

const spacing = {
  Tight: 'tight',
  Regular: 'regular',
  Loose: 'loose'
};

storiesOf('Structure/Stack', module)
  .addDecorator(
    moduleMetadata({
      imports: [ReadyUiModule]
    })
  )
  .add(
    'Stack',
    () => {
      return {
        styles: [
          `
          ready-ui-stack {
            width: 100%;
            height: 100vh;
            display: block;
          }
          .box {
            width: 80px;
            height: 30px;
            border-radius: 6px;
            background: #cecece;
          }
        `
        ],
        props: {
          spacing: select('Spacing', spacing, 'regular'),
          alignment: select('Alignment', alignment, 'start'),
          direction: select('Direction', directions, 'horizontal')
        },
        template: `
          <ready-ui-stack [alignment]="alignment" [direction]="direction" [spacing]="spacing">
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
          </ready-ui-stack>
        `
      };
    },
    {
      notes: readme
    }
  )
  .add(
    'Example',
    () => {
      return {
        template: `<ready-ui-card>
        <ready-ui-stack alignment="between">
          <button type="button" ui-button color="primary" variant="flat">Create</button>
          <ready-ui-stack alignment="end">
            <button type="button" ui-button color="primary" variant="flat">Invite</button>
            <button type="button" ui-button color="danger" variant="flat">Delete</button>
          </ready-ui-stack>
        </ready-ui-stack>
      </ready-ui-card>`
      };
    },
    {
      notes: `
      <ready-ui-card>
        <ready-ui-stack alignment="between">
          <button type="button" ui-button color="primary" variant="flat">Create</button>
          <ready-ui-stack alignment="end">
            <button type="button" ui-button color="primary" variant="flat">Invite</button>
            <button type="button" ui-button color="danger" variant="flat">Delete</button>
          </ready-ui-stack>
        </ready-ui-stack>
      </ready-ui-card>
    `
    }
  );
