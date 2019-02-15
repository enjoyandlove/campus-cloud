import { OnInit, Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { map, filter, takeUntil, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { CPI18nService } from '@shared/services';
import { Destroyable, Mixin } from '@shared/mixins';
import { IResourceBanner } from '@shared/components';
import { LocationsUtilsService } from '@libs/locations/common/utils';
import { IDining, IOpeningHours } from '@libs/locations/common/model';

@Mixin([Destroyable])

@Component({
  selector: 'cp-dining-info',
  templateUrl: './dining-info.component.html',
  styleUrls: ['./dining-info.component.scss']
})
export class DiningInfoComponent implements OnInit, OnDestroy, Destroyable {
  dining: IDining;
  hasMetaData: boolean;
  openingHours: IOpeningHours[];
  loading$: Observable<boolean>;
  resourceBanner: IResourceBanner;
  mapCenter: BehaviorSubject<any>;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    public router: Router,
    public cpI18n: CPI18nService,
    public locationUtils: LocationsUtilsService,
    public store: Store<fromStore.IDiningState | fromRoot.IHeader>
  ) {}

  buildHeader(dining: IDining) {
    this.store.dispatch({
      type: fromRoot.baseActions.HEADER_UPDATE,
      payload: {
        heading: `[NOTRANSLATE]${dining.name}[NOTRANSLATE]`,
        subheading: null,
        em: null,
        children: [],
        crumbs: {
          label: 'dining',
          url: '/manage/dining'
        }
      }
    });
  }

  loadDiningDetail() {
    this.store.select(fromStore.getSelectedDining).pipe(
      takeUntil(this.destroy$),
      filter((dining: IDining) => !!dining),
      map((dining: IDining) => {
        this.dining = dining;
        this.buildHeader(dining);

        this.resourceBanner = {
          heading: dining.name,
          image: dining.image_url,
          subheading: dining.category_name
        };

        this.mapCenter = new BehaviorSubject({
          lat: dining.latitude,
          lng: dining.longitude
        });

        const hasLinks = dining.links.length
          ? (dining.links[0].label || dining.links[0].url) : false;

        this.hasMetaData = Boolean(dining.short_name || dining.description || hasLinks);

        if (dining.schedule.length) {
          this.openingHours = this.locationUtils.parsedSchedule(dining.schedule);
        }
      })
    ).subscribe();
  }

  listenForErrors() {
    this.store
      .select(fromStore.getDiningError)
      .pipe(
        takeUntil(this.destroy$),
        filter((error) => error),
        tap(() => {
          const payload = {
            body: this.cpI18n.translate('something_went_wrong'),
            sticky: true,
            autoClose: true,
            class: 'danger'
          };

          this.store.dispatch({
            type: fromRoot.baseActions.SNACKBAR_SHOW,
            payload
          });

          this.store.dispatch(new fromStore.ResetError());
          this.router.navigate([`/manage/dining`]);
        })
      )
      .subscribe();
  }

  onEditClick() {
    this.router.navigate([`/manage/dining/${this.dining.id}/edit`]);
  }

  ngOnInit() {
    this.loading$ = this.store.select(fromStore.getDiningLoading);

    this.listenForErrors();
    this.loadDiningDetail();
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
