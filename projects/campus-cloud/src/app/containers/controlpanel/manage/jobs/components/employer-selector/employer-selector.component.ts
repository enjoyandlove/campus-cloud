import { Component, Input, OnInit } from '@angular/core';
import { startWith, map, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import { BaseComponent } from '@campus-cloud/base';
import * as fromJobs from '@campus-cloud/store/manage';
import { CPI18nService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-employer-selector',
  templateUrl: './employer-selector.component.html',
  styleUrls: ['./employer-selector.component.scss']
})
export class EmployerSelectorComponent extends BaseComponent implements OnInit {
  @Input() form: FormGroup;

  employers$;
  selectedEmployer;

  constructor(public cpI18n: CPI18nService, private store: Store<fromJobs.IJobsState>) {
    super();
  }

  onSelectedEmployer(store_id) {
    this.form.controls['store_id'].setValue(store_id);
  }

  getEmployers() {
    const dropdownLabel = this.cpI18n.translate('jobs_select_employer');
    this.employers$ = this.store.select(fromJobs.getJobsEmployers).pipe(
      startWith([{ label: dropdownLabel, action: null }]),
      map((employers) => [{ label: dropdownLabel, action: null }, ...employers]),
      tap((employers) => {
        const store_id = this.form.controls['store_id'].value;
        if (store_id) {
          this.selectedEmployer = employers.find((employer) => employer.action === store_id);
        }
      })
    );
  }

  ngOnInit() {
    this.getEmployers();

    this.store.select(fromJobs.getJobsEmployersLoaded).subscribe((loaded: boolean) => {
      if (!loaded) {
        this.store.dispatch(new fromJobs.LoadEmployers());
      }
    });
  }
}
