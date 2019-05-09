import { configure, addParameters } from '@storybook/angular';

import readyTheme from './ready.theme';

function loadStories() {
  require('../stories/index.ts');
}

addParameters({
  options: {
    theme: readyTheme,
    enableShortcuts: false,
    isToolshown: false
  }
});
configure(loadStories, module);
