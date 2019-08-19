import { OnInit, Component } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromActions from '../store/actions';
import { IAPIManagementState, IPublicApiAccessToken } from '../model';

@Component({
  selector: 'cp-api-create',
  templateUrl: './api-create.component.html',
  styleUrls: ['./api-create.component.scss']
})
export class ApiCreateComponent implements OnInit {
  constructor(private store: Store<IAPIManagementState>) {}

  onFormSubmitted(payload: IPublicApiAccessToken) {
    this.store.dispatch(fromActions.postRequest({ payload }));
  }

  ngOnInit() {}
}
