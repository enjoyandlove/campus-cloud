import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { takeUntil, map, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@campus-cloud/session';
import { IItem } from '@campus-cloud/shared/components';
import { Mixin, Destroyable } from '@campus-cloud/shared/mixins';
import { AnnouncementIntegrationModel } from '../model';
import { types } from '../../compose/announcement-types';
import { IStore, IModal, MODAL_DATA } from '@campus-cloud/shared/services';
import { AnnouncementPriority } from '../../announcements.interface';
import { RSS_ITEM, ATOM_ITEM } from '@campus-cloud/libs/integrations/common/providers';
import { IAnnouncementsIntegrationState } from '../store/reducers/integration.reducer';

@Component({
  selector: 'cp-announcements-integrations-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
@Mixin([Destroyable])
export class AnnouncementsIntegrationCreateComponent implements OnInit, OnDestroy, Destroyable {
  form: FormGroup;
  typesDropdown: IItem[];
  priorityDropdown: IItem[];
  stores$: Observable<IStore[]>;

  // Destroyable
  destroy$: Subject<null> = new Subject();
  emitDestroy() {}

  constructor(
    @Inject(MODAL_DATA) public modal: IModal,
    private session: CPSession,
    private store: Store<IAnnouncementsIntegrationState>
  ) {}

  resetModal() {
    this.modal.onClose();
  }

  doSubmit() {
    const body = this.form.value;
    this.store.dispatch(new fromStore.CreateIntegration(body));
    this.modal.onClose();
  }

  ngOnInit() {
    const schoolId = this.session.g.get('school').id;
    this.form = AnnouncementIntegrationModel.form();
    this.form.get('school_id').setValue(schoolId);

    this.typesDropdown = [RSS_ITEM, ATOM_ITEM];
    this.priorityDropdown = types.filter(
      (type: IItem) => type.action !== AnnouncementPriority.emergency
    );
    this.stores$ = this.store.select(fromStore.getSenders).pipe(
      takeUntil(this.destroy$),
      tap((stores: IStore[]) => {
        if (!stores.length) {
          this.store.dispatch(new fromStore.GetSenders());
        }
      }),
      map((stores: IStore[]) => (stores.length ? stores : [{ label: '---', value: null }]))
    );
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
