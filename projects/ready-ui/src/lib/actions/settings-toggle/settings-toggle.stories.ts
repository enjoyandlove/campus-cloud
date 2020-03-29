import { storiesOf, moduleMetadata } from '@storybook/angular';
import { centered } from '@storybook/addon-centered/angular';

import { SettingsToggleModule } from '@ready-education/ready-ui/actions';

storiesOf('Actions/Settings Toggle', module)
  .addDecorator(
    moduleMetadata({
      imports: [SettingsToggleModule]
    })
  )
  .addDecorator(centered)
  .add('basic', () => {
    return {
      template: `
      <ready-ui-settings-toggle label="Copy my Campus Cloud Permissions">
        Grant the new team member the same Campus Cloud permissions as me.
      </ready-ui-settings-toggle>
    `
    };
  });
