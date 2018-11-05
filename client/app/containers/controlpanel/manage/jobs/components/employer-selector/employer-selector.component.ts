import { Component, Input, OnInit } from '@angular/core';
import { startWith, map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import { JobsService } from '../../jobs.service';
import { BaseComponent } from '../../../../../../base';
import * as fromJobs from '../../../../../../store/manage';
import { CPI18nService } from '../../../../../../shared/services';

@Component({
  selector: 'cp-employer-selector',
  templateUrl: './employer-selector.component.html',
  styleUrls: ['./employer-selector.component.scss']
})
export class EmployerSelectorComponent extends BaseComponent implements OnInit {
  @Input() form: FormGroup;

  employers$;
  selectedEmployer;

  constructor(
    public cpI18n: CPI18nService,
    public jobsService: JobsService,
    private store: Store<fromJobs.IJobsState>
  ) {
    super();
  }

  onSelectedEmployer(store_id) {
    this.form.controls['store_id'].setValue(store_id);
  }

  getSelectedEmployer() {
    const store_id = this.form.controls['store_id'].value;
    if (store_id) {
      super.fetchData(this.employers$).then((employers) => {
        this.selectedEmployer = employers.data.filter(
          (employee) => employee.action === store_id
        )[0];
      });
    }
  }

  ngOnInit() {
    const dropdownLabel = this.cpI18n.translate('jobs_select_employer');
    this.employers$ = this.store
      .select(fromJobs.getJobsEmployers)
      .pipe(
        startWith([{ label: dropdownLabel }]),
        map((employers) => [{ label: dropdownLabel, action: null }, ...employers])
      );
    this.store.select(fromJobs.getJobsLoaded).subscribe((loaded: boolean) => {
      if (!loaded) {
        this.store.dispatch(new fromJobs.LoadEmployers());
      }
    });
    this.getSelectedEmployer();
  }
}
