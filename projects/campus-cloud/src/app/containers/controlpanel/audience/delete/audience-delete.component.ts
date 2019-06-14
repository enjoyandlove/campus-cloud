import {
  Input,
  OnInit,
  Output,
  Component,
  ElementRef,
  EventEmitter,
  HostListener
} from '@angular/core';

import { HttpParams } from '@angular/common/http';

import { CPSession } from '@app/session';
import { AudienceService } from '../audience.service';
import { amplitudeEvents } from '@shared/constants/analytics';
import { AudienceUtilsService } from '../audience.utils.service';
import { CPI18nService, CPTrackingService } from '@shared/services';

const AUDIENCE_USED_IN_TEMPLATE = 409;

@Component({
  selector: 'cp-audience-delete',
  templateUrl: './audience-delete.component.html',
  styleUrls: ['./audience-delete.component.scss']
})
export class AudienceDeleteComponent implements OnInit {
  @Input() audience: any;
  @Output() deleteAudience: EventEmitter<number> = new EventEmitter();

  buttonData;
  templateConflict = false;

  constructor(
    private el: ElementRef,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: AudienceService,
    private cpTracking: CPTrackingService,
    private audienceUtils: AudienceUtilsService
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    this.templateConflict = false;

    $('#audienceDeleteModal').modal('hide');
  }

  onDelete() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.service.deleteAudience(this.audience.id, search).subscribe(
      (_) => {
        this.trackEvent();

        $('#audienceDeleteModal').modal('hide');

        this.deleteAudience.emit(this.audience.id);

        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });
      },
      (err) => {
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });

        if (err.status === AUDIENCE_USED_IN_TEMPLATE) {
          this.templateConflict = true;

          return;
        }
      }
    );
  }

  trackEvent() {
    const eventProperties = this.audienceUtils.getAmplitudeEvent(this.audience);
    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_DELETED_AUDIENCE, eventProperties);
  }

  ngOnInit() {
    this.buttonData = {
      class: 'danger',
      text: this.cpI18n.translate('delete')
    };
  }
}
