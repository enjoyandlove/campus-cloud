import { storiesOf, moduleMetadata } from '@storybook/angular';
import { centered } from '@storybook/addon-centered/angular';
import { ReadyUiModule } from '@ready-education/ready-ui';
import { select, text } from '@storybook/addon-knobs';

const sizes = {
  Small: 'small',
  Regular: 'regular'
};

const icons = {
  today: 'today',
  info: 'info',
  link: 'link',
  close: 'close',
  done: 'done',
  thumb_up: 'thumb_up',
  warning: 'warning',
  cloud_upload: 'cloud_upload',
  mode_comment: 'mode_comment',
  expand_more: 'expand_more',
  arrow_downward: 'arrow_downward',
  arrow_upward: 'arrow_upward',
  search: 'search',
  volume_off: 'volume_off',
  chevron_right: 'chevron_right',
  expand_less: 'expand_less'
  help_outline: 'help_outline'
};

storiesOf('Icons', module)
  .addDecorator(
    moduleMetadata({
      imports: [ReadyUiModule]
    })
  )
  .addDecorator(centered)
  .add(
    'Icons',
    () => {
      return {
        props: {
          color: text('Color', '0d0d0d'),
          name: select('Icons', icons, 'cloud_upload'),
          size: select('Size', sizes, 'regular')
        },
        template: `
          <ready-ui-symbol></ready-ui-symbol>
          <ready-ui-icon [color]="color" [name]="name" [size]="size"></ready-ui-icon>
        `
      };
    },
    {
      notes: require('./icon/README.md')
    }
  );
