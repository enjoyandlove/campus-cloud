import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { JobsService } from '../../jobs.service';
import { BaseComponent } from '../../../../../../base';

@Component({
  selector: 'cp-employer-selector',
  templateUrl: './employer-selector.component.html',
  styleUrls: ['./employer-selector.component.scss']
})
export class EmployerSelectorComponent extends BaseComponent implements OnInit {
  @Input() form: FormGroup;

  employers$;
  selectedEmployer;

  constructor(public jobsService: JobsService) {
    super();
  }

  onSelectedEmployer(store_id) {
    this.form.controls['store_id'].setValue(store_id);
  }

  getSelectedEmployer() {
    const store_id = this.form.controls['store_id'].value;
    if (store_id) {
      super.fetchData(this.employers$).then((employers) => {
        this.selectedEmployer = employers.data.filter((employee) =>
          employee.action === store_id)[0];
      });
    }
  }

  ngOnInit() {
    this.employers$ = this.jobsService.getEmployers('new');
    this.getSelectedEmployer();
  }
}
