import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CPSession } from '../../../../../../../session';
import { StoreService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-personas-tile-form-link-of-links',
  templateUrl: './form-link-of-links.component.html',
  styleUrls: ['./form-link-of-links.component.scss']
})
export class PersonasTileFormLinkOfLinksComponent implements OnInit {
  @Output() selected: EventEmitter<any> = new EventEmitter();

  stores$;

  constructor(public storeService: StoreService, public session: CPSession) {}

  onChanged(selection) {
    const link_params = {
      ids: [...selection]
    };

    const meta = {
      is_system: 1,
      link_params,
      open_in_browser: 0,
      link_url: 'oohlala://campus_link_list'
    };

    this.selected.emit({ meta });
  }

  loadStores() {
    const search = new HttpParams().set('school_id', this.session.g.get('school').id);

    this.stores$ = this.storeService.getStores(search).pipe(
      map((stores) => {
        return stores.filter((store) => store.value).map((store: any) => {
          return {
            selected: false,
            label: store.label,
            action: store.value
          };
        });
      })
    );
  }

  ngOnInit(): void {
    this.loadStores();
  }
}
