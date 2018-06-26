import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { DashboardUtilsService } from './dashboard.utils.service';
import { CPSession, IUser } from '../../../session';
import { CP_PRIVILEGES_MAP } from '../../../shared/constants';
import { CPI18nService } from '../../../shared/services';
import { canSchoolReadResource } from '../../../shared/utils/privileges';

const isTileReady = (val) => !!val;

@Component({
  selector: 'cp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dateRanges;
  headerData;
  user: IUser;
  datePickerClass;
  canAssess = false;
  currentDate = null;
  canViewClub = false;
  areAllTilesReady = false;

  downloadsTile$ = new BehaviorSubject(false);
  generalInfoTile$ = new BehaviorSubject(false);
  topEventsTile$ = new BehaviorSubject(false);
  topServicesTile$ = new BehaviorSubject(false);
  assessmentTile$ = new BehaviorSubject(false);
  socialActivityTile$ = new BehaviorSubject(false);
  campusTileTile$ = new BehaviorSubject(false);
  topClubsTile$ = new BehaviorSubject(false);
  integrationsTile$ = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private session: CPSession,
    private route: ActivatedRoute,
    private cpI18n: CPI18nService,
    private helper: DashboardUtilsService
  ) {
    this.user = this.session.g.get('user');
  }

  readStateFromUrl(): void {
    const routeParams: any = this.route.snapshot.queryParams;

    this.currentDate = Object.assign({}, this.currentDate, {
      start: +routeParams.start,
      end: +routeParams.end,
      label: routeParams.label
    });
  }

  initState() {
    const defaultDate = this.helper.last30Days();

    this.currentDate = Object.assign({}, this.currentDate, { ...defaultDate });

    this.updateUrl();
  }

  updateUrl(): void {
    this.router.navigate(['/dashboard'], {
      queryParams: {
        start: this.currentDate.start,
        end: this.currentDate.end,
        label: this.currentDate.label
      }
    });
  }

  onDateChange(newDate) {
    this.currentDate = newDate;
    this.updateUrl();
  }

  updateHeader() {
    const hello = this.cpI18n.translate('hello');
    const username = `[NOTRANSLATE]${this.user.firstname}[NOTRANSLATE]`;
    const heading = `${hello} ${username}!`;

    this.headerData = {
      heading,
      crumbs: {
        url: null,
        label: null
      },
      subheading: null,
      em: null,
      children: []
    };
  }

  subscribeToTilesReadyEvent() {
    combineLatest([
      this.downloadsTile$,
      this.generalInfoTile$,
      this.topEventsTile$,
      this.topServicesTile$,
      this.assessmentTile$,
      this.socialActivityTile$,
      this.campusTileTile$,
      this.topClubsTile$,
      this.integrationsTile$
    ]).subscribe((tiles: any) => {
      setTimeout(
        () => {
          this.areAllTilesReady = tiles.every(isTileReady);
        },

        1
      );

      return tiles.every(isTileReady);
    });
  }

  ngOnInit() {
    this.dateRanges = [this.helper.last30Days(), this.helper.last90Days(), this.helper.lastYear()];

    this.canAssess = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.assessment);

    this.canViewClub = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.clubs);

    this.currentDate = this.helper.last30Days();

    this.datePickerClass = 'primary dropdown-toggle';

    if (
      this.route.snapshot.queryParams['start'] &&
      this.route.snapshot.queryParams['end'] &&
      this.route.snapshot.queryParams['label']
    ) {
      this.readStateFromUrl();
    } else {
      this.initState();
    }

    this.updateHeader();
  }
}
