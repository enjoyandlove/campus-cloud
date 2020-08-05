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
  selector: 'cp-form-unpublish',
  templateUrl: './form-unpublish.component.html',
  styleUrls: ['./form-unpublish.component.scss']
})
export class FormUnpublishComponent implements OnInit {
  @Input() form: Form;
  @Output() unpublishForm: EventEmitter<number> = new EventEmitter();

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
    $('#formUnpublishModal').modal('hide');
  }

  onUnpublish() {
    const formCopyForSave: Form = {
      id: this.form.id,
      is_published: false
    };
    const params = new HttpParams().set('school_id', this.session.g.get('school').id);
    this.formsService.updateForm(formCopyForSave, params).subscribe(
      (_) => {
        // ToDo: PJ: Revisit this amplitude code
        // this.trackEvent();

        $('#formUnpublishModal').modal('hide');

        this.unpublishForm.emit(this.form.id);

        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });
      },
      (err) => {
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });
      }
    );
  }

  // ToDo: PJ: Revisit this amplitude code
  // trackEvent() {
  //   const eventProperties = this.audienceUtils.getAmplitudeEvent(this.form);
  //   this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_DELETED_AUDIENCE, eventProperties);
  // }

  ngOnInit() {
    this.buttonData = {
      class: 'danger',
      text: this.cpI18n.translate('contact_trace_forms_unpublish')
    };
  }
}
