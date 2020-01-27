import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { ReadyUiModule } from '@ready-education/ready-ui';
import { boolean } from '@storybook/addon-knobs';

const fruits = ['Banana', 'Apples', 'Pears', 'Kiwis', 'Coconut'];
const searches = ['Summer', 'Semester', 'Exams', 'Friends', 'Stress', 'Help'];

storiesOf('Results Lists', module)
  .addDecorator(
    moduleMetadata({
      imports: [ReadyUiModule, ReactiveFormsModule]
    })
  )
  .add(
    'Results Lists',
    () => {
      const empty = boolean('No Results', false);

      return {
        props: {
          fruits,
          loading: boolean('Loading', false),
          clickHandler: (search: string) => alert(search),
          addHandler: (search: string) => alert(JSON.stringify(search)),
          searches: empty ? [] : searches.map((s: string) => ({ value: s, context: { item: s } }))
        },
        template: `
        <ready-ui-results-list [loading]="loading">
          <ready-ui-results-list-section name="Saved searches">
            <ready-ui-result-item
              [suffix]="suffix"
              [label]="search.value"
              [context]="search.context"
              *ngFor="let search of searches">
              <button
                ui-button
                type="button"
                variant="inline"
                (click)="clickHandler(search.value)">{{search.value}}</button>
            </ready-ui-result-item>
          </ready-ui-results-list-section>
          <ready-ui-results-list-section name="Fruits">
            <ready-ui-result-item
              [label]="fruit"
              *ngFor="let fruit of fruits">
              <button
                ui-button
                type="button"
                variant="inline"
                (click)="clickHandler(fruit)">{{fruit}}</button>
            </ready-ui-result-item>
          </ready-ui-results-list-section>
        </ready-ui-results-list>

        <ng-template #suffix let-item="item">
          <button
            ui-button
            type="button"
            color="primary"
            variant="inline"
            (click)="addHandler(item)">
            Add
          </button>
        </ng-template>
        <ng-template #prefix></ng-template>
      `
      };
    },
    { notes: require('./README.md') }
  )
  .add('No Section', () => {
    return {
      props: {
        fruits,
        eventHandler: (name: string) => alert(name)
      },
      template: `
      <ready-ui-results-list>
        <ready-ui-result-item
          [suffix]="suffix"
          [label]="fruit"
          *ngFor="let fruit of fruits"
          (click)="eventHandler(fruit)"
          (keyup.enter)="eventHandler(fruit)">
          {{ fruit }}
        </ready-ui-result-item>
      </ready-ui-results-list>
      `
    };
  })
  .add('With Popover', () => {
    const empty = boolean('No Results', false);
    const fb = new FormBuilder();
    const form = fb.group({
      name: [null, Validators.required]
    });

    return {
      props: {
        form,
        loading: boolean('Loading', false),
        clickHandler: (search: string) => alert(`Clicked on ${search}`),
        addHandler: (search: string) => form.get('name').setValue(search),
        searches: empty ? [] : searches.map((s: string) => ({ value: s, context: { item: s } }))
      },
      styles: [
        `
        .wrapper {
          width: 80vw;
        }
        input {
          width: 100%;
        }
      `
      ],
      template: `
        <ready-ui-symbol></ready-ui-symbol>
        <div class="wrapper">
          <div id="hiddenLabel" style="display: none">Results for: {{form.get('name').value}}</div>
          <form [formGroup]="form">
            <ready-ui-form-field [prefix]="inputPrefix" [suffix]="!form.get('name').value ? undefined : inputSuffix">
              <input
                type="text"
                ready-ui-input
                inheritWidth="true"
                uiPopoverYOffset="10"
                readyUiPopoverTrigger
                formControlName="name"
                [uiPopoverTpl]="popover"
                [value]="form.get('name').value" />
            </ready-ui-form-field>
          </form>

          <ng-template #inputPrefix>
            <ready-ui-icon name="search" size="small"></ready-ui-icon>
          </ng-template>

          <ng-template #inputSuffix>
            <button type="button" ui-button variant="inline" (click)="form.get('name').setValue('')">
              <ready-ui-icon name="close" size="small"></ready-ui-icon>
            </button>
          </ng-template>

          <ng-template #popover>
            <ready-ui-results-list [loading]="loading">
              <ready-ui-results-list-section name="Saved searches">
                <ready-ui-result-item
                  [suffix]="suffix"
                  [label]="search.value"
                  [context]="search.context"
                  *ngFor="let search of searches"
                  [highlight]="search.value === form.get('name').value">
                  <button
                    ui-button
                    type="button"
                    variant="inline"
                    (click)="clickHandler(search.value)">{{search.value}}</button>
                </ready-ui-result-item>
              </ready-ui-results-list-section>
            </ready-ui-results-list>

            <ng-template #suffix let-item="item">
              <button
                ui-button
                type="button"
                color="primary"
                variant="inline"
                (click)="addHandler(item)">Add</button>
            </ng-template>
          </ng-template>
        </div>
      `
    };
  });
