import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { centered } from '@storybook/addon-centered/angular';
import { boolean } from '@storybook/addon-knobs';

import { InputModule } from '@ready-education/ready-ui/forms';

storiesOf('Form/Input', module)
  .addDecorator(
    moduleMetadata({
      imports: [InputModule, ReactiveFormsModule]
    })
  )
  .addDecorator(centered)
  .add('input', () => {
    const disabled = boolean('Disabled', false);

    const form = new FormBuilder().group({
      name: [
        { value: '', disabled },
        Validators.compose([Validators.required, Validators.minLength(5)])
      ]
    });

    form.valueChanges.subscribe(() => console.log(form.value));
    return {
      props: {
        form
      },
      template: `
        <form [formGroup]="form">
          <input formControlName="name" class="another-class" type="text" ready-ui-input/>
        </form>
      `
    };
  })
  .add('textarea', () => {
    const disabled = boolean('Disabled', false);

    const form = new FormBuilder().group({
      name: [
        { value: '', disabled },
        Validators.compose([Validators.required, Validators.minLength(5)])
      ]
    });

    form.valueChanges.subscribe(() => console.log(form.value));
    return {
      props: {
        form
      },
      template: `
        <form [formGroup]="form">
          <textarea formControlName="name" class="another-class" type="text" ready-ui-input></textarea>
        </form>
      `
    };
  });
