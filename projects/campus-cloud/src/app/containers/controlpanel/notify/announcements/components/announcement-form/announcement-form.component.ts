import { Input, OnInit, Component, OnDestroy } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators';
import { takeUntil } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { AnnouncementPriority } from '../../model';
import { IStore, StoreService, CPI18nService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-announcement-form',
  templateUrl: './announcement-form.component.html',
  styleUrls: ['./announcement-form.component.scss']
})
export class AnnouncementFormComponent implements OnInit, OnDestroy {
  @Input()
  form: FormGroup;

  types = [
    {
      action: AnnouncementPriority.regular,
      disabled: false,
      label: this.cpI18n.translate('regular'),
      description: this.cpI18n.translate('announcements_regular_help')
    },
    {
      action: AnnouncementPriority.urgent,
      disabled: false,
      label: this.cpI18n.translate('urgent'),
      description: this.cpI18n.translate('announcements_urgent_help')
    },
    {
      action: AnnouncementPriority.emergency,
      disabled: false,
      label: this.cpI18n.translate('emergency'),
      description: this.cpI18n.translate('announcements_emergency_help')
    }
  ];
  selectedType;
  selectedStore: IStore;
  destroy$ = new Subject();
  stores$: Observable<IStore[]>;
  regularPriority = AnnouncementPriority.regular;

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private storeService: StoreService
  ) {}

  ngOnInit() {
    this.updateTypesBasedOnCampusWideStatus();
    const school = this.session.g.get('school');
    const search: HttpParams = new HttpParams().append('school_id', school.id.toString());

    this.stores$ = this.storeService.getStores(search).pipe(tap(this.setSelectedStore.bind(this)));

    this.selectedType = this.types.find((t) => t.action === this.form.get('priority').value);

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateTypesBasedOnCampusWideStatus();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get labelConfig() {
    const priority = this.form.get('priority').value;
    switch (priority) {
      case AnnouncementPriority.emergency:
        return {
          class: 'danger',
          label: this.cpI18n.translate('emergency')
        };

      case AnnouncementPriority.urgent:
        return {
          class: 'warning',
          label: this.cpI18n.translate('urgent')
        };

      default:
        return {
          class: '',
          label: ''
        };
    }
  }

  private updateTypesBasedOnCampusWideStatus() {
    this.types = this.types.map((t) => {
      return t.action !== AnnouncementPriority.emergency
        ? t
        : {
            ...t,
            disabled: this.form.get('is_school_wide').value
          };
    });
  }

  private setSelectedStore(stores: IStore[]) {
    this.selectedStore = stores.find((s) => s.value === this.form.get('store_id').value);
    return this.selectedStore;
  }
}
