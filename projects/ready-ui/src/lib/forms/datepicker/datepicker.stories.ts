import { storiesOf, moduleMetadata } from '@storybook/angular';

import { DatepickerModule } from './datepicker.module';

storiesOf('Date Picker', module)
  .addDecorator(
    moduleMetadata({
      imports: [DatepickerModule]
    })
  )
  .add(
    'Default',
    () => {
      return {
        template: '<ready-ui-date-picker></ready-ui-date-picker>'
      };
    },
    {
      notes: require('./README.md')
    }
  );
