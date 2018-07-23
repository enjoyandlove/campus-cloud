import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { of } from 'rxjs';
import { CPSession } from '../../../../../../../../session';
import { TilesService } from '../../../tiles.service';
import { CPI18nService } from '../../../../../../../../shared/services';

@Component({
  selector: 'cp-personas-resource-service-by-category',
  templateUrl: './resource-service-by-category.component.html',
  styleUrls: ['./resource-service-by-category.component.scss']
})
export class PersonasResourceServiceByCategoryComponent implements OnInit {
  @Output() selected: EventEmitter<any> = new EventEmitter();

  items$;
  options;
  state = {
    include: true,
    selection: []
  };

  constructor(
    public session: CPSession,
    public tileService: TilesService,
    public cpI18n: CPI18nService
  ) {}

  handleError() {
    return (this.items$ = of([{ label: 'ERROR' }]));
  }

  onMultiSelect(selection) {
    this.state = {
      ...this.state,
      selection
    };

    this.doEmit();
  }

  doEmit() {
    const key = this.state.include ? 'category_ids' : 'x_category_ids';

    const link_params = {
      [key]: [...this.state.selection]
    };

    this.selected.emit({
      meta: {
        is_system: 1,
        link_params,
        open_in_browser: 0,
        link_url: 'oohlala://campus_service_list'
      }
    });
  }

  onSelected({ action }) {
    this.state = {
      ...this.state,
      include: action === 'category_ids'
    };

    this.doEmit();
  }

  loadCategories() {
    const headers = new HttpParams().set('school_id', this.session.g.get('school').id);
    this.items$ = this.tileService.getServiceCategories(headers);
  }

  ngOnInit(): void {
    this.options = [
      {
        label: this.cpI18n.translate('t_personas_tile_form_categories_includes'),
        action: 'category_ids'
      },
      {
        label: this.cpI18n.translate('t_personas_tile_form_categories_excludes'),
        action: 'x_category_ids'
      }
    ];
    this.loadCategories();
  }
}
