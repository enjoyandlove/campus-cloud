/*tslint:disable:max-line-length */
import { Component, EventEmitter, OnInit, Output, Input, ViewChild } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { CPSession } from '@app/session';
import { CPI18nService } from '@shared/services';
import { CPDropdownMultiSelectComponent } from '@shared/components';
import { TilesService } from '@controlpanel/customise/personas/tiles/tiles.service';

enum LinkParam {
  'includes' = 'category_ids',
  'excludes' = 'x_category_ids'
}

@Component({
  selector: 'cp-resource-type-service-by-category',
  templateUrl: './resource-type-service-by-category.component.html',
  styleUrls: ['./resource-type-service-by-category.component.scss'],
  providers: [TilesService]
})
export class ResourceTypeServiceByCategoryComponent implements OnInit {
  @Input() params;

  @ViewChild('multiSelect') multiSelect: CPDropdownMultiSelectComponent;

  @Output() selected: EventEmitter<any> = new EventEmitter();

  items$;
  options = [
    {
      label: this.cpI18n.translate('t_personas_tile_form_categories_includes'),
      action: LinkParam.includes
    },
    {
      label: this.cpI18n.translate('t_personas_tile_form_categories_excludes'),
      action: LinkParam.excludes
    }
  ];
  isEditView;
  selectedFilter;
  state = {
    include: true,
    selection: []
  };
  multiSelectPlaceholder;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public tileService: TilesService
  ) {}

  onMultiSelect(selection) {
    this.state = {
      ...this.state,
      selection
    };

    this.doEmit();
  }

  doEmit() {
    const key = this.state.include ? LinkParam.includes : LinkParam.excludes;

    const link_params = {
      [key]: [...this.state.selection]
    };

    this.selected.emit({ link_params });
  }

  onSelected({ action }) {
    const include = action === LinkParam.includes;

    if (include !== this.state.include) {
      this.state = {
        ...this.state,
        selection: []
      };

      this.multiSelectPlaceholder = null;
      this.multiSelect.reset();
    }

    this.state = {
      ...this.state,
      include
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
    this.state = { ...this.state, include: LinkParam.includes in this.params };
    this.selectedFilter = this.options.filter((o) => o.action === paramKeyName)[0];
  }

  ngOnInit(): void {
    this.isEditView = Object.keys(this.params).length > 0;

    this.loadCategories();

    if (this.isEditView) {
      this.updateState();
    }
  }
}
