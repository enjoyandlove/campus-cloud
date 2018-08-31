import { map, tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
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
  @Input() params;

  @Output() selected: EventEmitter<any> = new EventEmitter();

  items$;
  options;
  isEditView;
  selectedFilter;
  state = {
    include: true,
    selection: []
  };
  multiSelectPlaceholder;

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

  updateItems(items) {
    if (this.isEditView) {
      const paramKeyName = Object.keys(this.params)[0];
      const categories = this.params[paramKeyName];

      return items.map((i) => {
        return i.action
          ? {
              ...i,
              selected: categories.includes(i.action)
            }
          : i;
      });
    }

    return items;
  }

  updateMultiSelectPlaceholder(items) {
    this.multiSelectPlaceholder = items
      .filter((i) => i.selected)
      .map((i) => i.label)
      .join(', ');
  }

  loadCategories() {
    const headers = new HttpParams().set('school_id', this.session.g.get('school').id);
    this.items$ = this.tileService
      .getServiceCategories(headers)
      .pipe(map(this.updateItems.bind(this)), tap(this.updateMultiSelectPlaceholder.bind(this)));
  }

  updateState() {
    const paramKeyName = Object.keys(this.params)[0];
    this.selectedFilter = this.options.filter((o) => o.action === paramKeyName)[0];
  }

  ngOnInit(): void {
    this.isEditView = Object.keys(this.params).length > 0;

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

    if (this.isEditView) {
      this.updateState();
    }
  }
}
