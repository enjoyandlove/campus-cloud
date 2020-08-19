import { Injectable } from '@angular/core';
import { CPSession } from '@campus-cloud/session';
import { Store } from '@ngrx/store';
import * as fromStore from '@campus-cloud/store';
import { baseActions } from '@campus-cloud/store';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { canAccountLevelReadResource, canSchoolReadResource } from '@campus-cloud/shared/utils';
import { get as _get } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ContactTraceHeaderService {
  privileges;

  constructor(private session: CPSession, private store: Store<fromStore.IHeader>) {
    this.privileges = require('../contact-trace.header.json'); // ToDo: PJ: revisit amplitude
  }

  updateHeader() {
    Promise.resolve().then(() => {
      this.store.dispatch({
        type: fromStore.baseActions.HEADER_UPDATE,
        payload: this.filterByPrivileges()
      });
    });
  }

  filterByPrivileges() {
    let _children;

    _children = this.privileges.children.filter((child) => {
      if (child.privilege === CP_PRIVILEGES_MAP.contact_trace_forms) {
        return canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.contact_trace_forms)
          ? child
          : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.contact_trace_qr) {
        return canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.contact_trace_qr)
          ? child
          : null;
      }
    });
    return Object.assign({}, this.privileges, { children: _children });
  }
}
