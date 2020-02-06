import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '@campus-cloud/session';
import { TemplatesService } from './../templates.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { TemplatesAmplitudeService } from '../templates.amplitude.service';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';

declare var $;

@Component({
  selector: 'cp-templates-delete',
  templateUrl: './templates-delete.component.html',
  styleUrls: ['./templates-delete.component.scss']
})
export class TemplatesDeleteComponent implements OnInit {
  @Input() item: any;
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  isError;
  buttonData;
  errorMessage;

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: TemplatesService,
    private cpTracking: CPTrackingService
  ) {}

  doReset() {
    this.isError = false;
    this.teardown.emit();
  }

  onDelete() {
    this.isError = false;
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.service.deleteTemplate(search, this.item.id).subscribe(
      (_) => {
        this.trackDeleteEvent(this.item);
        this.teardown.emit();
        this.deleted.emit(this.item.id);
        $('#deleteTemplateModal').modal('hide');
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: true
        });
      },
      (_) => {
        this.isError = true;
        this.errorMessage = this.cpI18n.translate('something_went_wrong');
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: true
        });
      }
    );
  }

  trackDeleteEvent(data) {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.DELETED_ITEM,
      this.cpTracking.getAmplitudeMenuProperties()
    );

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.NOTIFY_DELETED_COMMUNICATION, {
      sub_menu_name: amplitudeEvents.TEMPLATE,
      ...TemplatesAmplitudeService.getAmplitudeProperties(this.item as any, this.item.id)
    });
  }

  ngOnInit() {
    this.buttonData = {
      class: 'danger',
      text: this.cpI18n.translate('delete')
    };
  }
}
