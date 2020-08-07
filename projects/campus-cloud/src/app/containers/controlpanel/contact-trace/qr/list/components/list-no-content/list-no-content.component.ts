import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { BaseComponent } from '@campus-cloud/base/base.component';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';
interface IState {
  search_text: string;
  attendance_only: number;
  qrcodes: Array<any>;
  sort_field: string;
  sort_direction: string;
}

const state: IState = {
  qrcodes: [],
  search_text: null,
  attendance_only: 0,
  sort_field: 'name',
  sort_direction: 'asc'
};

@Component({
  selector: 'cp-qr-list-no-content',
  templateUrl: './list-no-content.component.html',
  styleUrls: ['./list-no-content.component.scss']
})
export class QrListNoContentComponent extends BaseComponent implements OnInit {
  @Output() importLocations: EventEmitter<null> = new EventEmitter();
  @Output() launchAddProviderModal: EventEmitter<null> = new EventEmitter();

  loading;
  eventData;
  activeModal: OverlayRef;
  state: IState = state;
  constructor(private cpTracking: CPTrackingService) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  launchModal() {
    $('#excelQrModal').modal({ keyboard: true, focus: true });
  }

  onImportLocations() {
    this.importLocations.emit();
  }

  onLaunchProviderAdd() {
    this.launchAddProviderModal.emit();
  }

  ngOnInit(): void {
    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.cpTracking.getAmplitudeMenuProperties()
    };
  }
}
