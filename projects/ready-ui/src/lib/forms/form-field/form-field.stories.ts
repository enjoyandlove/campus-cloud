import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { centered } from '@storybook/addon-centered/angular';

import { ButtonModule } from '@ready-education/ready-ui/actions';
import { IconsModule } from '@ready-education/ready-ui/images-and-icons';
import {
  HintModule,
  InputModule,
  LabelModule,
  ErrorModule,
  FormFieldModule
} from '@ready-education/ready-ui/forms';

storiesOf('Form Field', module)
  .addDecorator(
    moduleMetadata({
      imports: [
        HintModule,
        IconsModule,
        InputModule,
        LabelModule,
        ErrorModule,
        ButtonModule,
        FormFieldModule,
        ReactiveFormsModule
      ]
    })
  )
  .add('examples', () => {
    const form = new FormBuilder().group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      bio: ['', Validators.maxLength(512)]
    });

    return {
      styles: [
        `
        .wrapper {
          width: 100%;
          display: flex;
          margin: 0 auto;
          height: 100vh;
          align-items: center;
          justify-content: center;
        }

        form {
          width: 90%;
        }
      `
      ],
      props: {
        form
      },
      template: `
        <div class="wrapper">
          <ready-ui-symbol></ready-ui-symbol>
          <form [formGroup]="form">
            <ready-ui-form-field [prefix]="prefix" [suffix]="suffix">
              <label ready-ui-label for="name">First Name</label>
              <ready-ui-hint>Your details will not be shared with anyone</ready-ui-hint>
              <input formControlName="name" type="text" ready-ui-input id="name"/>
              <ready-ui-error *ngIf="form.get('name').hasError('required')">First Name is required</ready-ui-error>
              <ready-ui-error *ngIf="form.get('name').hasError('minlength')">Min length error</ready-ui-error>
            </ready-ui-form-field>
            <ready-ui-form-field>
              <label ready-ui-label for="bio">About you</label>
              <ready-ui-hint>512 characters</ready-ui-hint>
              <textarea formControlName="bio" type="text" ready-ui-input id="bio"></textarea>
              <ready-ui-error *ngIf="form.get('bio').hasError('maxlength')">Max length error</ready-ui-error>
            </ready-ui-form-field>
          </form>
          <ng-template #prefix>
            <ready-ui-icon name="today" size="small"></ready-ui-icon>
          </ng-template>
          <ng-template #suffix>
            <button type="button" ui-button variant="inline" aria-label="Clear first name">
              <ready-ui-icon name="close" size="small"></ready-ui-icon>
            </button>
          </ng-template>
        </div>
    `
    };
  });
