import { storiesOf, moduleMetadata } from '@storybook/angular';

import { PageModule } from '@ready-education/ready-ui/structure';
import { ButtonModule } from '@ready-education/ready-ui/actions';
import { StructureModule } from '@ready-education/ready-ui/structure';
import { ImagesAndIconsModule } from '@ready-education/ready-ui/images-and-icons';

storiesOf('Page (WIP)', module)
  .addParameters({
    showPanel: false
  })
  .addDecorator(
    moduleMetadata({
      imports: [PageModule, StructureModule, ButtonModule, ImagesAndIconsModule]
    })
  )
  .add('default', () => {
    return {
      styles: [
        `
        .fixed {
          width: 100%;
          position: fixed;
          margin-top: 1em;
        }

        ready-ui-page {
          margin-top: 4em;
        }

        ready-ui-stack[direction="vertical"] span {
          color: white;
          font-size: 0.9em;
          text-align: left;
          margin-bottom: 0 !important;
        }
        `
      ],
      template: `
      <ready-ui-symbol></ready-ui-symbol>
      <div class="fixed">
        <ready-ui-page-container>
          <ready-ui-stack alignment="between">
            <ready-ui-stack>
              <ready-ui-avatar src="http://placehold.it/40x40" alt="Campus Cloud"></ready-ui-avatar>
              <nav>
                <ready-ui-page-navigation>
                  <a href="#" ready-ui-page-navigation-item class="active">Manage</a>
                  <a href="#" ready-ui-page-navigation-item>Notify</a>
                  <a href="#" ready-ui-page-navigation-item>Assess</a>
                  <a href="#" ready-ui-page-navigation-item>Studio</a>
                </ready-ui-page-navigation>
              </nav>
            </ready-ui-stack>
            <button ui-button type="button" variant="inline">
              <ready-ui-stack>
                <ready-ui-avatar src="http://placehold.it/40x40" alt="Campus Cloud"></ready-ui-avatar>
                  <ready-ui-stack direction="vertical" spacing="tight">
                    <span>John Doe</span>
                    <span>Ready Education</span>
                  </ready-ui-stack>
              </ready-ui-stack>
            </button>
          </ready-ui-stack>
        </ready-ui-page-container>
      </div>
      <ready-ui-page heading="Manage" subheading="Manage your Campus App content">
        <ready-ui-page-crumbs>
          <a href="#" ready-ui-page-crumbs-item>Manage</a>
        </ready-ui-page-crumbs>
        <ready-ui-page-navigation>
          <a href="#" ready-ui-page-navigation-item class="active">Events</a>
          <a href="#" ready-ui-page-navigation-item>Community</a>
          <a href="#" ready-ui-page-navigation-item>Services</a>
        </ready-ui-page-navigation>
        <ready-ui-page-container>
          Content
        </ready-ui-page-container>
      </ready-ui-page>
      `
    };
  });
