import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { CPSession } from './../../../../../session';
import { CPI18nService } from '../../../../../shared/services';
import { AudienceSharedService } from './../audience.shared.service';

@Component({
  selector: 'cp-audience-dynamic',
  templateUrl: './audience-dynamic.component.html',
  styleUrls: ['./audience-dynamic.component.scss']
})
export class AudienceDynamicComponent implements OnInit {
  @Output() filters: EventEmitter<any> = new EventEmitter();

  form: FormGroup;

  filters$;
  maxFilterCount = 5;

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
  ) {}

  usedFiltersAsArray() {
    return Object.values(this.state.usedFilters);
  }

  onFilterSelected({ id, choices }, index) {
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

    this.selectedFilterOptions[index] = choices.map((choice) => {
      return {
        action: choice.id,
        label: choice.text,
        selected: false
      };
    });

    const controls = <FormArray>this.form.controls['filters'];
    const formGroup = <FormGroup>controls.at(index);

    formGroup.controls['attr_id'].setValue(id);

    this.filters.emit(this.form.value.filters);
  }

  onChoices(choices, index) {
    const controls = <FormArray>this.form.controls['filters'];
    const formGroup = <FormGroup>controls.at(index);

    formGroup.controls['choices'].setValue(choices);

    this.filters.emit(this.form.value.filters);
  }

  addFilterGroup() {
    this.state = { ...this.state, filterCount: this.state.filterCount + 1 };

    const control = <FormArray>this.form.controls['filters'];

    control.push(
      this.fb.group({
        attr_id: [null, Validators.required],
        choices: [[], Validators.required]
      })
    );

    this.selectedFilterOptions[control.length - 1] = [];
  }

  removeFilterGroup(index) {
    this.selectedFilterOptions[index] = [];

    const control = <FormArray>this.form.controls['filters'];

    control.removeAt(index);

    this.state = { ...this.state, filterCount: this.state.filterCount - 1 };
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      filters: this.fb.array([])
    });

    this.addFilterGroup();

    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    this.filters$ = this.service
      .getFilters(search)
      .startWith([
        {
          label: this.cpI18n.translate('select'),
          id: null
        }
      ])
      .map((response) => {
        return [
          {
            label: this.cpI18n.translate('select'),
            id: null,
            choices: []
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
  }
}
