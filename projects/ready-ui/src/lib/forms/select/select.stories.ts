import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { centered } from '@storybook/addon-centered/angular';
import { ReadyUiModule } from '@ready-education/ready-ui';
import { boolean } from '@storybook/addon-knobs';

const options = [
  { label: 'Theather Club', value: 1, hint: 'A theather club store', disabled: true },
  { label: 'Reading Club', value: 2, hint: 'A reading club store' },
  { label: 'Pottery Club', value: 3, hint: 'A pottery club store' },
  { label: 'Soccer Fans', value: 4, hint: 'A soccer club store' }
];

storiesOf('Select', module)
  .addDecorator(
    moduleMetadata({
      imports: [ReadyUiModule, ReactiveFormsModule]
    })
  )
  .addDecorator(centered)
  .add(
    'Select',
    () => {
      const disabled = boolean('Disabled', false);

      const form = new FormBuilder().group({
        store_id: [{ value: 2, disabled: disabled }, Validators.required]
      });

      return {
        props: {
          form,
          options,
          disabled
        },
        template: `
      <ready-ui-symbol></ready-ui-symbol>
      <form [formGroup]="form">
        <ready-ui-select label="Select a Host" formControlName="store_id">
          <ready-ui-option-group label="Clubs">
            <ready-ui-option
              [value]="option.value"
              [label]="option.label"
              [disabled]="option.disabled"
              *ngFor="let option of options">{{option.label}}</ready-ui-option>
          </ready-ui-option-group>
        </ready-ui-select>
      </form>
    `
      };
    },
    { notes: require('./README.md') }
  )
  .add('With Placeholder Value', () => {
    const form = new FormBuilder().group({
      store_id: ['', Validators.required]
    });

    const newOptions = [{ label: 'Pick One', value: '', disabled: false }, ...options];

    return {
      props: {
        form,
        options: newOptions
      },
      template: `
      <ready-ui-symbol></ready-ui-symbol>
      <form [formGroup]="form">
        <ready-ui-select label="Select a Host" formControlName="store_id">
          <ready-ui-option
            [value]="option.value"
            [label]="option.label"
            [disabled]="option.disabled"
            *ngFor="let option of options">{{option.label}}</ready-ui-option>
        </ready-ui-select>
      </form>
      `
    };
  })
  .add('With custom Option', () => {
    const form = new FormBuilder().group({
      store_id: ['', Validators.required]
    });

    return {
      props: {
        form,
        options
      },
      styles: [
        `
      span {
        display: block
      }
      `
      ],
      template: `
      <ready-ui-symbol></ready-ui-symbol>
      <form [formGroup]="form">
        <ready-ui-select label="Select a Host" formControlName="store_id">
          <ready-ui-option-group label="Clubs">
            <ready-ui-option
              [value]="option.value"
              [label]="option.label"
              [disabled]="option.disabled"
              *ngFor="let option of options">
              {{option.label}}
              <span ui-text-style color="muted">{{option.hint}}</span>
              </ready-ui-option>
          </ready-ui-option-group>
        </ready-ui-select>
      </form>
      `
    };
  });
