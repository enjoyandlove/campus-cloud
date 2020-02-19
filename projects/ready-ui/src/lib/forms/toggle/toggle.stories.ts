import { storiesOf, moduleMetadata } from '@storybook/angular';
import { centered } from '@storybook/addon-centered/angular';

import { ToggleModule } from '@ready-education/ready-ui/forms/toggle';

storiesOf('Toggle', module)
  .addDecorator(moduleMetadata({ imports: [ToggleModule] }))
  .addDecorator(centered)
  .add('toggle', () => {
    return {
      template: `
        <label id="enabled" style="display: none">Enabled</label>
        <ready-ui-toggle ariaLabelledBy="enabled"></ready-ui-toggle>
    `
    };
  });
