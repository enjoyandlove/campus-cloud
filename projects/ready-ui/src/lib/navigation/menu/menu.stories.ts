import { IconsModule } from '@ready-education/ready-ui/images-and-icons';
import { StructureModule } from '@ready-education/ready-ui/structure';
import { ReadyFormsModule } from '@ready-education/ready-ui/forms';
import { MenuModule } from '@ready-education/ready-ui/navigation';
import { ButtonModule } from '@ready-education/ready-ui/actions';
import { TextModule } from '@ready-education/ready-ui/text';
import { storiesOf, moduleMetadata } from '@storybook/angular';

const students = [
  'John Doe',
  'Mary Dane',
  'Will Peters',
  'Sandra Stevens',
  'Joe H',
  'Craig Harris'
];

const wallChannels = [
  'All Campus Wall Channels',
  'Student Feed',
  'Buy & Sell',
  'Housing',
  'News',
  'Lost and Found',
  'Integrated'
];

storiesOf('Menu', module)
  .addDecorator(
    moduleMetadata({
      imports: [
        MenuModule,
        TextModule,
        IconsModule,
        ButtonModule,
        StructureModule,
        ReadyFormsModule
      ]
    })
  )
  .add('menu', () => {
    return {
      props: {
        students,
        wallChannels
      },
      styles: [
        `
        .dates {
          padding: 1em 0.5em
        }

        ready-ui-stack ul {
          padding: 0;
        }

        ready-ui-stack ul li {
          list-style: none
        }

        .dates ul {
          height: 100%;
        }

        input[readonly] {
          display: none !important;
        }
        `
      ],
      template: `
      <ready-ui-symbol></ready-ui-symbol>
      <button ui-button [triggerFor]="primary" variant="stroked" color="primary"ready-ui-menu-trigger>
        <ready-ui-stack>
          <ready-ui-icon name="filter_list">Filter</ready-ui-icon>
          Filter
        </ready-ui-stack>
      </button>

      <ready-ui-menu id="primary" #primary="menu">
        <ready-ui-menu-item ready-ui-menu-trigger [triggerFor]="users">
          <button variant="inline" type="button" ui-button color="inherit">
            <ready-ui-icon name="person" size="small"></ready-ui-icon>
            Users
          </button>
        </ready-ui-menu-item>
        <ready-ui-menu-item ready-ui-menu-trigger [triggerFor]="channels">
          <button variant="inline" type="button" ui-button color="inherit">
            <ready-ui-icon name="ready-app" size="small"></ready-ui-icon>
            Channels
          </button>
        </ready-ui-menu-item>
        <ready-ui-menu-item ready-ui-menu-trigger [triggerFor]="status">
          <button variant="inline" type="button" ui-button color="inherit">
            <ready-ui-icon name="flag" size="small"></ready-ui-icon>
            Status
          </button>
        </ready-ui-menu-item>
        <ready-ui-menu-item ready-ui-menu-trigger [triggerFor]="date">
          <button variant="inline" type="button" ui-button color="inherit">
            <ready-ui-icon name="today" size="small"></ready-ui-icon>
            Date
          </button>
        </ready-ui-menu-item>
        <ready-ui-menu-divider></ready-ui-menu-divider>
        <ready-ui-menu-item>
          <button ui-button type="button" variant="inline">
            <ui-text-style color="muted" variant="caption">
              <ready-ui-stack>
                <ready-ui-icon name="close" size="small"></ready-ui-icon>
                Clear filters
              </ready-ui-stack>
            </ui-text-style>
          </button>
        </ready-ui-menu-item>
      </ready-ui-menu>

      <ready-ui-menu id="users" #users="menu">
        <ready-ui-menu-item *ngFor="let student of students; let first = first" [disabled]="first">
          <ready-ui-stack>
            <ready-ui-checkbox [label]="student" [disabled]="first"></ready-ui-checkbox>
          </ready-ui-stack>
        </ready-ui-menu-item>
        <ready-ui-menu-item>
          <button ui-button type="button" variant="inline">
            <ui-text-style variant="caption" color="muted" fullWidth="true">Load More</ui-text-style>
          </button>
        </ready-ui-menu-item>
      </ready-ui-menu>

      <ready-ui-menu id="channels" #channels="menu">
        <ready-ui-menu-section name="Campus Wall Channels">
          <ready-ui-menu-item *ngFor="let channel of wallChannels">{{channel}}</ready-ui-menu-item>
        </ready-ui-menu-section>
      </ready-ui-menu>

      <ready-ui-menu id="status" #status="menu">
        <ready-ui-menu-item label="Flagged">Flagged</ready-ui-menu-item>
        <ready-ui-menu-item label="Archived">Archived</ready-ui-menu-item>
      </ready-ui-menu>

      <ready-ui-menu id="date" #date="menu">
        <ready-ui-stack class="dates" spacing="loose">
          <ul ui-stack direction="vertical">
            <li><button ui-button type="button" variant="inline">Last 7 Days</button></li>
            <li><button ui-button type="button" variant="inline">Last 30 Days</button></li>
            <li><button ui-button type="button" variant="inline">Last 90 Days</button></li>
            <li><button ui-button type="button" variant="inline">Last year</button></li>
          </ul>
          <input readonly type="text" inline="true" static="true" ready-ui-date-picker/>
        </ready-ui-stack>
      </ready-ui-menu>
      `
    };
  });
