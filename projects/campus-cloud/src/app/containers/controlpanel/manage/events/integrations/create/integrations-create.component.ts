import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { takeUntil, map, tap, startWith } from 'rxjs/operators';
import { Observable, Subject, combineLatest } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@campus-cloud/session';
import { IItem } from '@campus-cloud/shared/components';
import { IStore, ZendeskService, IModal } from '@campus-cloud/shared/services';
import { EventIntegration } from '@campus-cloud/libs/integrations/events/model';
import { READY_MODAL_DATA } from '@ready-education/ready-ui/overlays/modal/modal.service';
import { CommonIntegrationUtilsService } from '@campus-cloud/libs/integrations/common/providers';

import {
  IPreviewResponse,
  IntegrationResourceTypes
} from '@campus-cloud/libs/integrations/common/model';

@Component({
  selector: 'cp-events-integrations-create',
  templateUrl: './integrations-create.component.html',
  styleUrls: ['./integrations-create.component.scss']
})
export class EventsIntegrationsCreateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  hostType: string;
  typesDropdown: IItem[];
  destroy$ = new Subject();
  selectedType: IItem | null;
  widerModal$: Observable<boolean>;
  previewError$: Observable<string>;
  disableSubmit$: Observable<boolean>;
  previewLoading$: Observable<boolean>;
  stores$: Observable<IStore[] | IItem[]>;
  preview$: Observable<IPreviewResponse[]>;
  eventIntegrationPkdbUrl = `${ZendeskService.getUrl('articles/360021952274')}`;

  constructor(
    @Inject(READY_MODAL_DATA) public modal: IModal,
    public session: CPSession,
    public store: Store<fromStore.IEventIntegrationState>
  ) {}

  resetModal() {
    this.form.reset();
    this.modal.onClose();
  }

  doSubmit() {
    if (!this.form.valid) {
      return;
    }

    const body = this.form.value;

    const payload = {
      body,
      hostType: this.hostType
    };

    this.store.dispatch(new fromStore.CreateAndSync(payload));

    this.resetModal();
  }

  onHostSelected(host_type) {
    this.hostType = host_type;
  }

  loadPreview() {
    this.store.dispatch(
      new fromStore.PreviewFeed({
        school_id: this.form.get('school_id').value,
        external_feed_url: this.form.get('feed_url').value,
        external_feed_type: this.form.get('feed_type').value,
        external_feed_resource_type: IntegrationResourceTypes.event
      })
    );
  }

  ngOnInit(): void {
    const schoolId = this.session.g.get('school').id;

    this.form = EventIntegration.form();
    this.form.get('school_id').setValue(schoolId);

    this.stores$ = this.store.select(fromStore.getIntegrationsHosts).pipe(
      takeUntil(this.destroy$),
      tap((stores: IStore[]) => {
        if (!stores.length) {
          this.store.dispatch(new fromStore.GetHosts());
        }
      }),
      map((res) => (res.length ? res : [{ label: '---', action: null }]))
    );

    this.typesDropdown = CommonIntegrationUtilsService.typesDropdown();
    this.selectedType = this.typesDropdown.find(
      (t) => t.action === this.form.get('feed_type').value
    );

    this.preview$ = this.store.select(fromStore.getPreview);
    this.previewError$ = this.store.select(fromStore.getPreviewError);
    this.previewLoading$ = this.store.select(fromStore.getPreviewLoading);
    this.store.dispatch(new fromStore.PreviewFeedReset());

    const invalidForm$ = this.form.valueChanges.pipe(map(() => this.form.invalid));

    this.disableSubmit$ = combineLatest([
      this.preview$.pipe(
        map((preview) => preview === null),
        startWith(true)
      ),
      invalidForm$
    ]).pipe(
      map(([preview, invalidForm]) => preview || invalidForm),
      startWith(true)
    );

    this.widerModal$ = combineLatest([this.preview$, this.previewError$]).pipe(
      map(([preview, previewError]) => preview !== null && !previewError)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
