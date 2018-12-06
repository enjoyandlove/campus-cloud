import { Component, OnInit, Input } from '@angular/core';
// import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
// import { tap, take, map } from 'rxjs/operators';
// import { Store } from '@ngrx/store';
import { CPSession } from '@app/session';
import { EventIntegration } from './../../model';
import { IItem } from '@shared/components/cp-dropdown';
import { CommonIntegrationUtilsService } from './../../../common/providers';

@Component({
  selector: 'cp-events-integrations-form',
  templateUrl: './integrations-form.component.html',
  styleUrls: ['./integrations-form.component.scss']
})
export class EventIntegrationFormComponent implements OnInit {
  @Input() integration: EventIntegration;

  @Input() stores;

  selectedItem;
  form: FormGroup;
  typesDropdown: Array<IItem>;
  stores$: Observable<Array<{ label: string; value: number }>>;

  constructor(private session: CPSession, private utils: CommonIntegrationUtilsService) {}

  onHostSelected({ value }) {
    this.form.get('store_id').setValue(value);
  }

  onTypeSelected({ action }) {
    this.form.get('feed_type').setValue(action);
  }

  onImageUpload(image) {
    this.form.get('poster_url').setValue(image);
    this.form.get('poster_thumb_url').setValue(image);
  }

  selectedStoreLookup(stores) {
    const storeId = this.integration.store_id;

    if (storeId) {
      const selectedStore = stores.filter((s) => s.value === storeId)[0];
      this.selectedItem = selectedStore ? selectedStore : null;
    }

    return stores;
  }

  ngOnInit(): void {
    this.form = EventIntegration.form(this.integration);

    this.typesDropdown = this.utils.typesDropdown();

    const school_id = this.session.g.get('school').id;
    console.log(school_id);
    // const params = new HttpParams().set('school_id', school_id);

    // // avoid calling getStores every time we open the component
    // this.store
    //   .select(fromStore.getIntegrationsHosts)
    //   .pipe(
    //     tap((stores: any[]) => {
    //       if (!stores.length) {
    //         this.store.dispatch(new fromStore.GetHosts({ params }));
    //       }
    //     }),
    //     take(1)
    //   )
    //   .subscribe();

    // this.stores$ = this.store
    //   .select(fromStore.getIntegrationsHosts)
    //   .pipe(map(this.selectedStoreLookup.bind(this)));
  }
}
