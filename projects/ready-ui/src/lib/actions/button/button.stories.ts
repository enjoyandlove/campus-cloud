import {
  IconsModule,
  StackModule,
  ButtonModule,
  PopoverModule,
  ButtonGroupModule
} from '@ready-education/ready-ui';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { centered } from '@storybook/addon-centered/angular';
import { select, text } from '@storybook/addon-knobs';

const variants = {
  Flat: 'flat',
  Basic: 'basic',
  Inline: 'inline',
  Stroked: 'stroked'
};

const color = {
  White: 'white',
  Danger: 'danger',
  Primary: 'primary',
  Warning: 'warning',
  Default: 'default'
};

const disabled = {
  True: 'disabled',
  False: null
};

storiesOf('Button', module)
  .addDecorator(
    moduleMetadata({
      imports: [ButtonModule, IconsModule, PopoverModule, StackModule, ButtonGroupModule]
    })
  )
  .addDecorator(centered)
  .add(
    'Button',
    () => {
      return {
        props: {
          text: text('Button Text', 'Hello'),
          color: select('Color', color, 'primary'),
          variant: select('Variant', variants, 'flat'),
          disabled: select('Disabled', disabled, null)
        },
        template: `
        <button
          ui-button
          type="button"
          [color]="color"
          [variant]="variant"
          [disabled]="disabled"
          type="button">{{text}}</button>`
      };
    },
    {
      notes: require('./README.md')
    }
  )
  .add('Button with icon', () => {
    return {
      template: `
        <ready-ui-symbol></ready-ui-symbol>
        <button
          ui-button
          type="button"
          color="primary"
          variant="flat"
          type="button">
            <ready-ui-stack spacing="tight">
              <span>Like</span>
              <ready-ui-icon name="thumb_up" color="fff" size="small"></ready-ui-icon>
            </ready-ui-stack>
          </button>`
    };
  })
  .add('Only Icon', () => {
    return {
      template: `
      <ready-ui-symbol></ready-ui-symbol>
      <button
        ui-button
        type="button"
        variant="flat"
        color="primary"
        readyUiPopoverTrigger
        [uiPopoverTpl]="popover">
          <ready-ui-icon name="link" size="small" color="fff"></ready-ui-icon>
      </button>
      `
    };
  })
  .add('Button Group', () => {
    return {
      props: {
        clickHandler: (message: string) => alert(message)
      },
      template: `
        <ready-ui-button-group>
        <button type="button" ui-button color="primary" variant="flat" (click)="clickHandler('Save')">Save</button>
          <button type="button" ui-button color="primary" variant="flat" (click)="clickHandler('Create')">Create</button>
          <button type="button" ui-button color="primary" variant="flat" (click)="clickHandler('Validate')">Validate</button>
        </ready-ui-button-group>
      `
    };
  })
  .add('Button with dropdown', () => {
    return {
      styles: [
        `
        .popover {
          width: 10.5em;
          padding: 1em;
          display: flex;
          background: white;
          text-align: right;
          align-items: end;
          flex-direction: column;
        }
        .popover button {
          display: block;
        }
        .popover button:not(:last-child) {
          margin-bottom: 0.5em;
        }
      `
      ],
      props: {
        buttonHandler: () => alert('Button Clicked'),
        handleAlert: (message: string) => alert(message)
      },
      template: `
        <ready-ui-symbol></ready-ui-symbol>
        <ready-ui-button-group>
          <button ui-button type="button" variant="flat" color="primary" (click)="buttonHandler()">Create Event</button>
          <button
            ui-button
            type="button"
            variant="flat"
            color="primary"
            #menu="popover"
            position="right"
            uiPopoverYOffset="5"
            uiPopoverXOffset="-147"
            readyUiPopoverTrigger
            [uiPopoverTpl]="popover">
              <ready-ui-icon name="expand_more" size="small" color="fff"></ready-ui-icon>
          </button>
          <ng-template #popover>
            <div class="popover">
              <button type="button" ui-button variant="inline" (click)="handleAlert('From Url'); menu.close()">From URL</button>
              <button type="button" ui-button variant="inline" (click)="handleAlert('From CSV'); menu.close()">Import from CSV</button>
            </div>
          </ng-template>
        </ready-ui-button-group>
      `
    };
  });
