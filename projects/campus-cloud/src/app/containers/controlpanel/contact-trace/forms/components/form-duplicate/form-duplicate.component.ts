import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Form, FormsService } from '@controlpanel/contact-trace/forms';
import { map } from 'rxjs/operators';
import { CPSession } from '@campus-cloud/session';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'cp-form-duplicate',
  templateUrl: './form-duplicate.component.html',
  styleUrls: ['./form-duplicate.component.scss']
})
export class FormDuplicateComponent implements OnInit {

  private FORM_PROPERTIES: string[] = [
    'name',
    'description',
    'is_confirmation_required',
    'form_block_list',
    'form_type',
    'allow_web_collection',
    'allow_app_collection',
    'auth_requirement',
    'user_response_limit',
    'ver_required',
    'school_id',
    'daily_reminder_enabled'
  ];

  @Output() duplicateForm: EventEmitter<any> = new EventEmitter();

  _form: Form;
  inputForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    formId: new FormControl()
  });

  @Input()
  public set form(form: Form) {
    this._form = form;
  }

  buttonData;

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal
    if (event.target.contains(this.el.nativeElement)) {
      this.hideModal();
    }
  }

  constructor(private el: ElementRef, private cPI18nPipe: CPI18nPipe,
              private formsService: FormsService, private session: CPSession) {
  }

  ngOnInit(): void {
    const duplicateFormName = this.cPI18nPipe.transform(
      'contact_trace_forms_duplicate_new_name', this._form.name);
    this.inputForm.reset({
      name: duplicateFormName,
      formId: this._form.id
    });

    this.buttonData = {
      class: 'primary',
      text: this.cPI18nPipe.transform('save')
    };
  }

  onDuplicate() {
    this.formsService.getForm(this.inputForm.value.formId, null).pipe(map((res: Form) => {
      const form: Form = this.pick<Form>(res, this.FORM_PROPERTIES) as Form;
      return form;
    })).subscribe(value => {
      const duplicatedForm: Form = {
        ...value,
        name: this.inputForm.value.name,
        school_id: this.session.g.get('school').id,
        is_published: false,
        open_until_epoch: -1
      };

      this.formsService.createForm(duplicatedForm, null).subscribe(createdForm => {
        this.duplicateForm.emit({
          duplicatedForm: createdForm,
          parentForm: this.inputForm.value.formId
        });

        this.hideModal();
      }, error => {
        this.hideModal();
      });
    }, error => {
      this.hideModal();
    });
  }

  private hideModal() {
    $('#formDuplicateModal').modal('hide');
    this.buttonData = Object.assign({}, this.buttonData, {
      disabled: false
    });
  }

  pick<T>(obj: T, objectKeys: string[]): T {
    const copy = {} as T;
    objectKeys.forEach(key => copy[key] = obj[key]);
    return copy;
  }
}
