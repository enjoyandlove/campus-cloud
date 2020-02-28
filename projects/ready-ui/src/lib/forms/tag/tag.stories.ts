import { IconsModule } from '@ready-education/ready-ui/images-and-icons';
import { ButtonModule } from '@ready-education/ready-ui/actions/button';
import { StackModule } from '@ready-education/ready-ui/structure';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { TagModule } from '@ready-education/ready-ui/forms';
import { centered } from '@storybook/addon-centered/angular';
import { select, boolean } from '@storybook/addon-knobs';

const colors = {
  Primary: 'primary',
  Default: 'default'
};

const variants = {
  Flat: 'flat',
  Stroked: 'stroked'
};

storiesOf('Tag', module)
  .addDecorator(centered)
  .addDecorator(
    moduleMetadata({
      imports: [TagModule, StackModule, ButtonModule, IconsModule]
    })
  )
  .add('styles', () => {
    return {
      props: {
        close: boolean('Can Close', false),
        color: select('Color', colors, 'default'),
        variant: select('Variants', variants, 'stroked')
      },
      template: `
      <ready-ui-symbol></ready-ui-symbol>
      <ready-ui-tag [color]="color" [variant]="variant">
        <ready-ui-stack spacing="tight">
          <ready-ui-icon name="ready-app" size="small"></ready-ui-icon>
          <span>All Campus Walls Channels</span>
          <button ui-button
            type="button"
            *ngIf="close"
            color="inherit"
            variant="inline">
            <ready-ui-icon name="close"
                          size="small"></ready-ui-icon>
          </button>
        </ready-ui-stack>
      </ready-ui-tag>
      `
    };
  });
