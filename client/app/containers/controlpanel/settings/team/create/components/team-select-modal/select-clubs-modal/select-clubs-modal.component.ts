import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CPSession } from '../../../../../../../../session';
import { CP_PRIVILEGES_MAP } from '../../../../../../../../shared/constants';
import { ClubsService } from '../../../../../../manage/clubs/clubs.service';
import { clubAthleticStatus, isClubAthletic } from '../../../../team.utils.service';
import { BaseTeamSelectModalComponent } from '../base/team-select-modal.component';
import { clubOnlyPermissions } from '../permissions';

@Component({
  selector: 'cp-select-clubs-modal',
  templateUrl: './select-clubs-modal.component.html'
})
export class SelectTeamClubsModalComponent extends BaseTeamSelectModalComponent implements OnInit {
  @Input() selectedClubs: any;
  @Input() reset: Observable<boolean>;

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  data$: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(public session: CPSession, private service: ClubsService) {
    super(session);
    this.privilegeType = CP_PRIVILEGES_MAP.clubs;
    this.privileges = clubOnlyPermissions;
  }

  doReset() {
    this.teardown.emit();
  }

  ngOnInit() {
    const search = new HttpParams()
      .append('school_id', this.session.g.get('school').id.toString())
      .append('category_id', isClubAthletic.club.toString());

    this.service
      .getClubs(search, 1, 1000)
      .pipe(
        map((clubs: Array<any>) =>
          clubs.filter((club) => club.status === clubAthleticStatus.active)
        )
      )
      .subscribe((clubs) => {
        let res = {};
        const selected = {};

        if (this.selectedClubs) {
          clubs.map((club) => {
            if (Object.keys(this.selectedClubs).includes(club.id.toString())) {
              if (CP_PRIVILEGES_MAP.clubs in this.selectedClubs[club.id]) {
                selected[club.id] = {
                  ...club,
                  write: this.selectedClubs[club.id][CP_PRIVILEGES_MAP.clubs].w,
                  read: this.selectedClubs[club.id][CP_PRIVILEGES_MAP.clubs].r
                };
              }
            }

            if (selected[club.id]) {
              club.checked = true;
              // we pass the id to the selected object
              // to populate the modal state....
              selected[club.id] = Object.assign({}, selected[club.id], {
                id: club.id
              });
            }
          });
        }
        res = {
          data: clubs,
          selected: selected
        };

        this.data$.next(res);
      });
  }
}
