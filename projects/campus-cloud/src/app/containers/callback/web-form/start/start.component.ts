import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';

import { BaseComponent } from '@campus-cloud/base/base.component';
import { CPI18nService } from '@campus-cloud/shared/services';

import { WebFormService } from '../web-form.service';
import { FormState } from '../form-state.interface';
import { start, reset } from '../web-form.actions';
import { setError } from '../web-form-error.actions';

@Component({
  selector: 'app-web-form-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent extends BaseComponent implements OnInit {
  formId: string;
  startForm: FormGroup;

  @Input() webFormData: any;

  constructor(
    public cpI18n: CPI18nService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<{ webForm: FormState }>,
    private webFormService: WebFormService
  ) {
    super();
  }

  continue(e) {
    const { email } = this.startForm.value;

    if (!this.startForm.valid) {
      Object.keys(this.startForm.controls).forEach((field) => {
        const control = this.startForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    } else {
      // Create a From Response
      this.webFormService.createForm(this.formId, email).subscribe(
        (response: any) => {
          this.store.dispatch(
            start({
              formResponseId: response.id,
              externalUserId: email
            })
          );
          this.router.navigate([
            `cb/web-form/${this.formId}/${this.webFormData.init_form_block_id}`
          ]);
        },
        () => {
          this.store.dispatch(
            setError({
              message: this.cpI18n.translate('web_form_action_not_successful')
            })
          );
        }
      );
    }
  }

  ngOnInit() {
    // Landing on the start page should reset the Form State
    // TODO: Seems a bit buggy when tampering with the URL
    this.store.dispatch(reset());

    this.route.params.subscribe((params) => {
      const { formId } = params;
      this.formId = formId;
    });

    this.startForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ])
    });
  }

  get email() {
    return this.startForm.get('email');
  }
}
