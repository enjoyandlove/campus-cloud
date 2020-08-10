import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { WebFormService } from '../web-form.service';
import { FormState } from '../form-state.interface';

@Component({
  selector: 'app-web-form',
  templateUrl: './web-form.component.html',
  styleUrls: ['./web-form.component.scss']
})
export class WebFormComponent extends BaseComponent implements OnInit {
  webFormData: any;
  formState: FormState;
  formBlockId: string;
  currentFormBlock: any;
  errorMessage: string;

  constructor(
    private store: Store<{ webForm: FormState; webFormError: string }>,
    private webFormService: WebFormService,
    private route: ActivatedRoute
  ) {
    super();
    this.store.pipe(select('webForm')).subscribe((formState: FormState) => {
      this.formState = formState;
    });
    this.store.pipe(select('webFormError')).subscribe((errorMessage: string) => {
      this.errorMessage = errorMessage;
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.formBlockId = params['formBlockId'];
      this.currentFormBlock = null;

      this.webFormService.getForm(params['formId']).subscribe(
        (webFormData: any) => {
          this.webFormData = webFormData;
          this.currentFormBlock = webFormData['form_block_list'].find(
            (formBlock: any) => formBlock.id === parseInt(params['formBlockId'], 10)
          );
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }
}
