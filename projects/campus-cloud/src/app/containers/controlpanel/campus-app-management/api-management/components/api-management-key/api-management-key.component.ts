import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { ISnackbar } from '@campus-cloud/store';
import { baseActionClass } from '@campus-cloud/store/base';
import { CPI18nService } from '@campus-cloud/shared/services';
import { ApiManagementUtilsService } from '../../api-management.utils.service';

@Component({
  selector: 'cp-api-management-key',
  templateUrl: './api-management-key.component.html',
  styleUrls: ['./api-management-key.component.scss']
})
export class ApiManagementKeyComponent implements OnInit {
  @Input() key: string;

  keyPrefix: string;
  isTextVisible = false;

  constructor(private cpI18n: CPI18nService, private store: Store<ISnackbar>) {}

  notify() {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.translate('t_api_management_copied_to_clipboard')
      })
    );
  }

  ngOnInit() {
    this.keyPrefix = ApiManagementUtilsService.getAPIKeyPrefix(this.key);
  }
}
