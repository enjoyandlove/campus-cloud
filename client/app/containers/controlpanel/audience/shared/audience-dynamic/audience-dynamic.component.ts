import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { find } from 'lodash';

import { BaseComponent } from '../../../../../base';
import { CPSession } from './../../../../../session';
import { CPI18nService } from '../../../../../shared/services';
import { AudienceSharedService } from './../audience.shared.service';

@Component({
  selector: 'cp-audience-dynamic',
  templateUrl: './audience-dynamic.component.html',
  styleUrls: ['./audience-dynamic.component.scss']
})
export class AudienceDynamicComponent extends BaseComponent implements OnInit {
  @Input() audience = null;
  @Input() message: string;

  @Output() filters: EventEmitter<any> = new EventEmitter();

  form: FormGroup;

  loading;
  filtersData;
  selectedItem = [];
  maxFilterCount = 5;
  filterDropdownPlaceholer;

  selectedFilterOptions = {};

  state = {
    saved: false,
    filterCount: 0,
    usedFilters: {}
  };

  constructor(
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: AudienceSharedService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  usedFiltersAsArray() {
    return Object.values(this.state.usedFilters);
  }

  parseChoice(choice, selected = false) {
    return {
      action: choice.id,
      label: choice.text,
      selected
    };
  }

  onFilterSelected({ id, choices }, index) {
    const controls = <FormArray>this.form.controls['filters'];
    const formGroup = <FormGroup>controls.at(index);
    /**
     * top option in the dropdown
     * id is set to null we reset all fields
     */
    if (!id) {
      this.selectedFilterOptions[index] = [];
      this.state = {
        ...this.state,
        usedFilters: { ...this.state.usedFilters, [index]: null }
      };
    }

    this.state = { ...this.state, usedFilters: { ...this.state.usedFilters, [index]: id } };

    this.selectedFilterOptions[index] = choices.map((choice) => this.parseChoice(choice));

    formGroup.controls['attr_id'].setValue(id);
    formGroup.controls['choices'].setValue([]);

    this.filters.emit(this.form.value.filters);
  }

  onChoices(choices, index) {
    const controls = <FormArray>this.form.controls['filters'];
    const formGroup = <FormGroup>controls.at(index);

    formGroup.controls['choices'].setValue(choices);

    this.filters.emit(this.form.value.filters);
  }

  addFilterGroup(filter = { attr_id: null, choices: [] }) {
    this.state = { ...this.state, filterCount: this.state.filterCount + 1 };

    const control = <FormArray>this.form.controls['filters'];

    control.push(
      this.fb.group({
        attr_id: [filter.attr_id, Validators.required],
        choices: [filter.choices, Validators.required]
      })
    );

    this.selectedFilterOptions[control.length - 1] = [];
  }

  removeFilterGroup(index) {
    this.state = { ...this.state, usedFilters: delete this.state.usedFilters[index] };

    const control = <FormArray>this.form.controls['filters'];

    control.removeAt(index);

    this.state = { ...this.state, filterCount: this.state.filterCount - 1 };

    this.filters.emit(this.form.value.filters);
  }

  preloadFilters() {
    this.audience.filters.forEach((filter, index) => {
      // update usedFilters
      this.state = {
        ...this.state,
        usedFilters: { ...this.state.usedFilters, [index]: filter.attr_id }
      };

      // add row
      this.addFilterGroup(filter);

      // populate filter label
      this.selectedItem.push(find(this.filtersData, (f: any) => f.id === filter.attr_id));

      // populate choices
      const choices = this.selectedItem[index].choices;
      const isSelected = (id) => filter.choices.includes(id);

      this.selectedFilterOptions[index] = choices.map((choice) =>
        this.parseChoice(choice, isSelected(choice.id))
      );
    });
  }

  fetch() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    const stream$ = this.service
      .getFilters(search)
      .startWith([
        {
          id: null,
          heading: true,
          label: this.cpI18n.translate('select_filter')
        }
      ])
      .map((response) => {
        return [
          {
            id: null,
            heading: true,
            label: this.cpI18n.translate('select_filter')
          },
          ...response.map((item) => {
            return {
              id: item.id,
              label: item.title_text,
              choices: item.choices
            };
          })
        ];
      });

    super.fetchData(stream$).then(({ data }) => {
      this.filtersData = data;

      this.audience ? this.preloadFilters() : this.addFilterGroup();
    });
  }

  ngOnInit(): void {
    this.filterDropdownPlaceholer = this.cpI18n.translate('select_filter_value');
    this.form = this.fb.group({
      filters: this.fb.array([])
    });

    this.fetch();
  }
}
