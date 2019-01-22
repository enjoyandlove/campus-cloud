import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { LinksService } from '../links.service';
import { amplitudeEvents } from '@shared/constants/analytics';
import { CPTrackingService, ErrorService } from '@shared/services';

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

  eventProperties;

  constructor(
    private service: LinksService,
    private errorService: ErrorService,
    private cpTracking: CPTrackingService
  ) {}

  onDelete() {
    this.service.deleteLink(this.link.id).subscribe(
      () => {
        this.trackEvent();

        this.deleteLink.emit(this.link.id);

        this.resetModal();
      },
      (err) => {
        this.errorService.handleError(err);
      }
    );
  }

  resetModal() {
    this.resetDeleteModal.emit();
    $('#linksDelete').modal('hide');
  }

  trackEvent() {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.cpTracking.getEventProperties()
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.DELETED_ITEM, this.eventProperties);
  }

  ngOnInit() {}
}
