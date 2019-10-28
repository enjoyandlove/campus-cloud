import { OnInit, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromActions from '../store/actions';
import { IAPIManagementState } from '../model';
import { ApiManagementUtilsService } from '../api-management.utils.service';

@Component({
  selector: 'cp-api-create',
  templateUrl: './api-create.component.html',
  styleUrls: ['./api-create.component.scss']
})
export class ApiCreateComponent implements OnInit {
  constructor(private store: Store<IAPIManagementState>) {}

  onFormSubmitted(form: FormGroup) {
    const payload = ApiManagementUtilsService.parseFormValue(form);

    this.store.dispatch(fromActions.postRequest({ payload }));
  }

  ngOnInit() {}
}
