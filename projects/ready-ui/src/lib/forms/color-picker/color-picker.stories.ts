import { storiesOf, moduleMetadata } from '@storybook/angular';
import { ColorPickerModule } from '@ready-education/ready-ui';
import { centered } from '@storybook/addon-centered/angular';
import { boolean } from '@storybook/addon-knobs';

storiesOf('Color Picker', module)
  .addDecorator(
    moduleMetadata({
      imports: [ColorPickerModule]
    })
  )
  .addDecorator(centered)
  .add(
    'Color Picker',
    () => {
      return {
        props: {
          hue: boolean('Hue', true),
          preview: boolean('Preview', true),
          opacity: boolean('Ppacity', true),
          save: boolean('Save', true),
          hex: boolean('HEX', true),
          rgba: boolean('RGBA', true),
          hsla: boolean('HSLA', true),
          hsva: boolean('HSVA', true),
          cmyk: boolean('CMYK', true),
          input: boolean('Input', true),
          clear: boolean('Clear', true),

          events: ['save', 'change'],
          pickr({ event, args }: { event: string; args: any[] }) {
            if (event === 'save') {
              alert({ save: { ...args } });
            }
            if (event === 'change') {
              alert({ change: { ...args } });
            }
          }
        },
        template: `
        <div
          [hue]="hue"
          [preview]="preview"
          [opacity]="opacity"
          [save]="save"
          [hex]="hex"
          [rgba]="rgba"
          [hsla]="hsla"
          [hsva]="hsva"
          [cmyk]="cmyk"
          [input]="input"
          [clear]="clear"
          [events]="events"
          ready-ui-color-picker
          (pickr)="pickr($event)">Hello</div>`
      };
    },
    {
      notes: require('./README.md')
    }
  );
