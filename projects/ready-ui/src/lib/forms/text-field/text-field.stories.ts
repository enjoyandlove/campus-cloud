import { TextFieldModule, ButtonModule, IconsModule, StackModule } from '@ready-education/ready-ui';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { text, boolean, number } from '@storybook/addon-knobs';

storiesOf('Text Field', module)
  .addDecorator(
    moduleMetadata({
      imports: [TextFieldModule, StackModule, ButtonModule, IconsModule]
    })
  )
  .add(
    'Simple',
    () => {
      const maxLength = number('Max character length', 0);

      return {
        props: {
          maxLength,
          textArea: boolean('Text Area', false),
          readonly: boolean('Read Only Input', false)
        },
        styles: [
          `
      .wrapper {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        justify-items: center;
      }
      .content {
        width: 90vw;
      }
      `
        ],
        template: `
      <div class="wrapper">
        <div class="content">
          <ready-ui-text-field
            type="text"
            label="Name"
            [readonly]="readonly"
            [maxLength]="maxLength"
            [textAreaElement]="textArea"
          ></ready-ui-text-field>
        </div>
      </div>
      `
      };
    },
    { notes: require('./README.md') }
  )
  .add('Advanced', () => {
    return {
      props: {
        disabled: boolean('Disabled', false),
        helpText: text('Help Text', ''),
        errorMessage: text('Error Message', '')
      },
      styles: [
        `
        .wrapper {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          justify-items: center;
        }
        .content {
          width: 90vw;
        }
      `
      ],
      template: `
      <ready-ui-symbol></ready-ui-symbol>
      <div class="wrapper">
        <div class="content">
          <ready-ui-text-field
            maxLength="250"
            [suffix]="suffix"
            [prefix]="prefix"
            label="First Name"
            [disabled]="disabled"
            [helpText]="helpText"
            [errorMessage]="errorMessage"></ready-ui-text-field>
        </div>
      </div>

      <ng-template #suffix>
        <ready-ui-stack spacing="tight">
          <button ui-button variant="inline" color="primary">Save</button>
          <button ui-button variant="inline" color="danger">Delete</button>
          </ready-ui-stack>
      </ng-template>

      <ng-template #prefix>
        <ready-ui-icon name="today" size="small"></ready-ui-icon>
      </ng-template>
      `
    };
  });
