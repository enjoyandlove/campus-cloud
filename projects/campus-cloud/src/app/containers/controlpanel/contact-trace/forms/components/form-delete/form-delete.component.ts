import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { CPSession } from '@campus-cloud/session';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { HttpParams } from '@angular/common/http';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { Form } from '@controlpanel/contact-trace/forms/models';
import { FormsService } from '@controlpanel/contact-trace/forms/services';

@Component({
  selector: 'cp-form-delete',
  templateUrl: './form-delete.component.html',
  styleUrls: ['./form-delete.component.scss']
})
export class FormDeleteComponent implements OnInit {
  @Input() form: Form;
  @Output() deleteForm: EventEmitter<number> = new EventEmitter();

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
    $('#formDeleteModal').modal('hide');
  }

  onDelete() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.formsService.deleteForm(this.form.id, search).subscribe(
      (_) => {
        // ToDo: PJ: Revisit this amplitude code
        // this.trackEvent();

        $('#formDeleteModal').modal('hide');

        this.deleteForm.emit(this.form.id);

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
      text: this.cpI18n.translate('delete')
    };
  }
}
