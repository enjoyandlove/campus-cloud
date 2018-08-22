import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { LinksService } from '../links.service';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService, ErrorService } from '../../../../../shared/services';

declare var $: any;

@Component({
  selector: 'cp-links-delete',
  templateUrl: './links-delete.component.html',
  styleUrls: ['./links-delete.component.scss']
})
export class LinksDeleteComponent implements OnInit {
  @Input() link: any;
  @Output() deleteLink: EventEmitter<number> = new EventEmitter();
  @Output() resetDeleteModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  eventProperties;

  constructor(
    private service: LinksService,
    private cpI18n: CPI18nService,
    private errorService: ErrorService,
    private cpTracking: CPTrackingService
  ) {}

  onDelete() {
    this.service.deleteLink(this.link.id).subscribe(
      () => {
        this.trackEvent();

        $('#linksDelete').modal('hide');

        this.deleteLink.emit(this.link.id);

        this.resetModal();
      },
      (err) => {
        this.errorService.handleError(err);

        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });
      }
    );
  }

  resetModal() {
    this.buttonData = Object.assign({}, this.buttonData, { disabled: false });

    this.resetDeleteModal.emit();
  }

  trackEvent() {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.cpTracking.getEventProperties()
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.DELETED_ITEM, this.eventProperties);
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };
  }
}
