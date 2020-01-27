import { storiesOf, moduleMetadata } from '@storybook/angular';
import { centered } from '@storybook/addon-centered/angular';
import { ReadyUiModule } from '@ready-education/ready-ui';
import { boolean, text } from '@storybook/addon-knobs';

const toolbar = [
  ['bold', 'italic', 'underline'],
  ['blockquote'],

  [{ list: 'ordered' }, { list: 'bullet' }],

  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }],
  [{ align: [] }],

  ['clean']
];

storiesOf('Text Editor', module)
  .addDecorator(
    moduleMetadata({
      imports: [ReadyUiModule]
    })
  )
  .addDecorator(centered)
  .add(
    'Text Editor',
    () => {
      const hideToolbar = boolean('Hide Toolbar', false);
      return {
        styles: [
          `
      .wrapper {
        width: 90vw;
      }
      `
        ],
        props: {
          readOnly: boolean('Read Only', false),
          placeholder: text('Placeholder', ''),
          toolbar: hideToolbar ? false : toolbar,
          events: ['text-change', 'editor-change'],
          onChange({ event, args }: { event: string; args: any[] }) {
            console.log(JSON.stringify({ event, args }));
          }
        },
        template: `
        <div class="wrapper">
          <div
            [events]="events"
            [toolbar]="toolbar"
            [readOnly]="readOnly"
            ready-ui-text-editor
            [placeholder]="placeholder"
            (editor)="onChange($event)">
          </div>
        </div>`
      };
    },
    { notes: require('./README.md') }
  );
