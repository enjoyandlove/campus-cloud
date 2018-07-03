import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CPSession } from '../../../../../../../session';
import { TilesService } from '../../tiles.service';

@Component({
  selector: 'cp-personas-tile-form-link-of-links',
  templateUrl: './form-link-of-links.component.html',
  styleUrls: ['./form-link-of-links.component.scss']
})
export class PersonasTileFormLinkOfLinksComponent implements OnInit {
  @Output() selected: EventEmitter<any> = new EventEmitter();

  links$;

  constructor(public tileServide: TilesService, public session: CPSession) {}

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

  loadSchoolLinks() {
    const search = new HttpParams().set('school_id', this.session.g.get('school').id);

    this.links$ = this.tileServide.getSchoolLinks(search).pipe(
      map((links) => {
        return links.filter((link) => link.action).map((link: any) => {
          return {
            selected: false,
            label: link.label,
            action: link.action
          };
        });
      })
    );
  }

  ngOnInit(): void {
    this.loadSchoolLinks();
  }
}
