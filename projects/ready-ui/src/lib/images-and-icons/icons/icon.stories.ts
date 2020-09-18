import { storiesOf, moduleMetadata } from '@storybook/angular';
import { centered } from '@storybook/addon-centered/angular';
import { ReadyUiModule } from '@ready-education/ready-ui';
import { select, text } from '@storybook/addon-knobs';

import readme from './icon/README.md';

const sizes = {
  Small: 'small',
  Regular: 'regular',
  Large: 'large'
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
  expand_less: 'expand_less',
  save_alt: 'save_alt',
  keyboard_arrow_up: 'keyboard_arrow_up',
  keyboard_arrow_down: 'keyboard_arrow_down',
  settings_applications: 'settings_applications',
  edit: 'edit',
  control_point_duplicate: 'control_point_duplicate',
  computer: 'computer',
  smartphone: 'smartphone',
  help_outline: 'help_outline',
  chat_bubble: 'chat_bubble',
  'ready-app': 'ready-app',
  filter_list: 'filter_list',
  flag: 'flag',
  person: 'person',
  arrow_back: 'arrow_back',
  add_circle: 'add_circle',
  add_circle_outline: 'add_circle_outline',
  collections: 'collections',
  more_vert: 'more_vert',
  delete: 'delete',
  vertical_align_bottom: 'vertical_align_bottom'
};

storiesOf('Images and Icons/Icons', module)
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
      notes: readme
    }
  );
