import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ClubsService } from '../clubs.service';
import { CPTrackingService } from '../../../../../shared/services';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { isClubAthletic, clubAthleticLabels } from '../clubs.athletics.labels';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';

@Component({
  selector: 'cp-clubs-delete',
  templateUrl: './clubs-delete.component.html',
  styleUrls: ['./clubs-delete.component.scss']
})
export class ClubsDeleteComponent implements OnInit {
  @Input() club: any;
  @Input() isAthletic = isClubAthletic.club;
  @Output() error: EventEmitter<string> = new EventEmitter();
  @Output() deletedClub: EventEmitter<number> = new EventEmitter();

  labels;
  buttonData;

  constructor(
    private service: ClubsService,
    private cpI18n: CPI18nService,
    private cpTracking: CPTrackingService
  ) {}

  onDelete() {
    this.service.deleteClubById(this.club.id).subscribe(
      (_) => {
        this.trackEvent();

        this.deletedClub.emit(this.club.id);

        $('#deleteClubsModal').modal('hide');

        this.buttonData = { ...this.buttonData, disabled: false };
      },

      (err) => {
        $('#deleteClubsModal').modal('hide');

        this.buttonData = { ...this.buttonData, disabled: false };

        this.error.emit(
          err.status === 403 ? 'clubs_delete_error_unauthorized' : 'something_went_wrong'
        );
      }
    );
  }

  trackEvent() {
    const eventProperties = {
      ...this.cpTracking.getEventProperties()
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.DELETED_ITEM, eventProperties);
  }

  ngOnInit() {
    this.labels = clubAthleticLabels(this.isAthletic);
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };
  }
}
