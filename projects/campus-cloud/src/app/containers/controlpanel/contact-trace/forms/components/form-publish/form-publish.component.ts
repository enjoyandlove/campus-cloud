import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Form } from '@controlpanel/contact-trace/forms/models';
import { CPSession } from '@campus-cloud/session';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { FormsService } from '@controlpanel/contact-trace/forms/services';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'cp-form-publish',
  templateUrl: './form-publish.component.html',
  styleUrls: ['./form-publish.component.scss']
})
export class FormPublishComponent implements OnInit {
  @Input() form: Form;
  @Output() publishForm: EventEmitter<Form> = new EventEmitter();

  buttonData;

  constructor(
    private el: ElementRef,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private cpTracking: CPTrackingService,
    private formsService: FormsService
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    $('#formPublishModal').modal('hide');
  }

  onPublish() {
    const params = new HttpParams().set('school_id', this.session.g.get('school').id);
    const formCopyForSave: Form = { ...this.form, is_published: true };
    if (!formCopyForSave.id) {
      this.formsService.createForm(formCopyForSave, params).subscribe(
        (form) => {
          this.handleFormPublishSuccess(form);
        },
        (err) => {
          this.handleFormPublishError();
        }
      );
    } else {
      this.formsService.updateForm(formCopyForSave, params).subscribe(
        (form) => {
          this.handleFormPublishSuccess(form);
        },
        (err) => {
          this.handleFormPublishError();
        }
      );
    }
  }

  private handleFormPublishSuccess(form: Form): void {
    // ToDo: PJ: Revisit this amplitude code
    // this.trackEvent();

    $('#formPublishModal').modal('hide');

    this.publishForm.emit(form);

    this.buttonData = Object.assign({}, this.buttonData, {
      disabled: false
    });
  }

  private handleFormPublishError(): void {
    $('#formPublishModal').modal('hide');
    this.buttonData = Object.assign({}, this.buttonData, {
      disabled: false
    });
  }

  // ToDo: PJ: Revisit this amplitude code
  // trackEvent() {
  //   const eventProperties = this.audienceUtils.getAmplitudeEvent(this.form);
  //   this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_DELETED_AUDIENCE, eventProperties);
  // }

  ngOnInit() {
    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('contact_trace_forms_publish')
    };
  }
}
