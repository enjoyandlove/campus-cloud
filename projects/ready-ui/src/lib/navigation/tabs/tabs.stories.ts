import { storiesOf, moduleMetadata } from '@storybook/angular';

import { TabsModule } from '@ready-education/ready-ui/navigation';

storiesOf('Navigation/Tabs', module)
  .addDecorator(
    moduleMetadata({
      imports: [TabsModule]
    })
  )
  .add('tabs', () => {
    return {
      template: `
        <ready-ui-tabs>
          <ready-ui-tab id="one" label="Action 1">
            Content for Action 1
          </ready-ui-tab>
          <ready-ui-tab id="two" label="Action 2">
            Content for Action 2
          </ready-ui-tab>
          <ready-ui-tab id="three" label="Disabled Tab" disabled="true">
            Content for Action 3
          </ready-ui-tab>
        </ready-ui-tabs>
    `
    };
  });
