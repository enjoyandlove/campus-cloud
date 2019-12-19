import { configure, addDecorator, addParameters } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
addDecorator(withNotes);
addDecorator(withKnobs);

// https://storybook.js.org/docs/configurations/options-parameter/
addParameters({
  options: {
    name: 'Ready UI',
    panelPosition: 'right',
    sidebarAnimations: false
  }
});

const req = require.context('../', true, /\.stories\.ts$/);
function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
