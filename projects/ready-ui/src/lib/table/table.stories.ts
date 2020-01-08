import {
  IconsModule,
  TableModule,
  ImageModule,
  StackModule,
  ButtonModule
} from '@ready-education/ready-ui';
import { storiesOf, moduleMetadata } from '@storybook/angular';

storiesOf('Table', module)
  .addDecorator(
    moduleMetadata({
      imports: [TableModule, ButtonModule, ImageModule, StackModule, IconsModule]
    })
  )
  .add(
    'Basic',
    () => {
      return {
        props: {},
        styles: [
          `
          .wrapper {
            width: 90%;
            display: flex;
            height: 100vh;
            margin: 0 auto;
            align-items: center;
          }`
        ],
        template: `
        <ready-ui-symbol></ready-ui-symbol>
        <div class="wrapper">
          <table ui-table>
            <thead>
              <tr ui-table-row>
                <th ui-table-cell>Name</th>
                <th ui-table-cell>Email</th>
                <th ui-table-cell></th>
              <tr>
            </thead>
            <tbody>
              <tr ui-table-row>
                <td ui-table-cell>Jane</td>
                <td ui-table-cell>jane@email.com</td>
                <td ui-table-cell align="right">
                  <button ui-button variant="inline" color="primary">Save</button>
                </td>
              </tr>
              <tr ui-table-row>
                <td ui-table-cell>Mary</td>
                <td ui-table-cell>mary@email.com</td>
                <td ui-table-cell align="right">
                  <button ui-button variant="inline" color="primary">Save</button>
                </td>
              </tr>
            <tbody>
          </table>
        </div>
        `
      };
    },
    {
      notes: require('./table/README.md')
    }
  )
  .add('Advanced', () => {
    return {
      props: {},
      styles: [
        `
          .wrapper {
            width: 90%;
            display: flex;
            height: 100vh;
            margin: 0 auto;
            align-items: center;
          }
          h3 {
            margin: 0;
            font-size: 1em;
          }
          small {
            color: #828282;
            font-size: 0.8em;
          }
        `
      ],
      template: `
        <ready-ui-symbol></ready-ui-symbol>
        <div class="wrapper">
          <table ui-table>
            <thead>
              <tr ui-table-row>
                <th ui-table-cell sorting sortDirection="asc">Name</th>
                <th ui-table-cell>Email</th>
                <th ui-table-cell></th>
              <tr>
            </thead>
            <tbody>
              <tr ui-table-row>
                <td ui-table-cell>
                  <a ui-button href="#" variant="inline">
                    <div ui-stack>
                      <ready-ui-avatar src="https://placehold.it/40x40" alt="Jane"></ready-ui-avatar>
                      <div>
                        <h3>Jane</h3>
                        <small>Details</small>
                      </div>
                    </div>
                  </a>
                </td>
                <td ui-table-cell>jane@email.com</td>
                <td ui-table-cell align="right">
                  <button ui-button variant="inline" color="primary">Save</button>
                </td>
              </tr>
              <tr ui-table-row>
                <td ui-table-cell>
                  <div ui-stack>
                    <ready-ui-avatar src="https://placehold.it/40x40" alt="Mary"></ready-ui-avatar>
                    <div>
                      <h3>Jane</h3>
                      <small>Details</small>
                    </div>
                  </div>
                </td>
                <td ui-table-cell>mary@email.com</td>
                <td ui-table-cell align="right">
                <button ui-button variant="inline">
                    <ready-ui-icon name="mode_comment"></ready-ui-icon>
                  </button>
                  <button ui-button variant="inline">
                    <ready-ui-icon name="today"></ready-ui-icon>
                  </button>
                </td>
              </tr>
            <tbody>
          </table>
        </div>
        `
    };
  });
