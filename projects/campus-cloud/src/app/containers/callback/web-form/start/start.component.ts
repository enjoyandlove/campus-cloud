import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';

import { BaseComponent } from '@campus-cloud/base/base.component';
import { WebFormService } from '../web-form.service';
import { FormState } from '../form-state.interface';
import { start, reset } from '../web-form.actions';

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
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<{ webForm: FormState }>,
    private webFormService: WebFormService
  ) {
    super();
  }

  continue(e) {
    const { email } = this.startForm.value;

    // Create a From Response
    this.webFormService.createForm(this.formId, email).subscribe(
      (response: any) => {
        this.store.dispatch(
          start({
            formResponseId: response.id,
            externalUserId: email
          })
        );
        this.router.navigate([`cb/web-form/${this.formId}/${this.webFormData.init_form_block_id}`]);
      },
      (error: any) => {
        console.log(error);
      }
    );
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
