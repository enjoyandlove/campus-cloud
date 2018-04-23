import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { CPI18nService } from '../../../../../shared/services';
import { AudienceSharedService } from './../audience.shared.service';

@Component({
  selector: 'cp-audience-dynamic',
  templateUrl: './audience-dynamic.component.html',
  styleUrls: ['./audience-dynamic.component.scss']
})
export class AudienceDynamicComponent implements OnInit {
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
    public cpI18n: CPI18nService,
    public service: AudienceSharedService
  ) {}

  usedFiltersAsArray() {
    return Object.values(this.state.usedFilters);
  }

  onFilterSelected({ id, choices }, index) {
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
        action: choice,
        label: choice,
        selected: false
      };
    });
  }

  onChoices() {
    // console.log(choices, index);
  }

  fakeSubmit() {
    // console.log(this.form.value);
  }

  addFilterGroup() {
    this.state = { ...this.state, filterCount: this.state.filterCount + 1 };

    const control = <FormArray>this.form.controls['filters'];

    control.push(
      this.fb.group({
        filterName: [null, Validators.required],
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

    this.filters$ = this.service
      .getDynamic()
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
