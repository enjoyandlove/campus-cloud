import { PopoverModule, ButtonModule } from '@ready-education/ready-ui';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { DatepickerModule } from '@ready-education/ready-ui';

storiesOf('Date Picker (WIP)', module)
  .addDecorator(
    moduleMetadata({
      imports: [PopoverModule, ButtonModule, DatepickerModule]
    })
  )
  .add(
    'Inline',
    () => {
      return {
        template: '<ready-ui-date-picker></ready-ui-date-picker>'
      };
    },
    {
      notes: require('./README.md')
    }
  )
  .add('Inside Popover', () => {
    return {
      template: `
      <ready-ui-popover>
        <button ui-button
                type="button"
                uiPopoverYOffset="0"
                readyUiPopoverTrigger>Open</button>
        <ready-ui-date-picker timeLabel="Select Time" (click)="$event.stopPropagation()">
        </ready-ui-date-picker>
      </ready-ui-popover>
      `
    };
  });
