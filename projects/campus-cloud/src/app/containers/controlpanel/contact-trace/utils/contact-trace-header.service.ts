import { Injectable } from '@angular/core';
import { CPSession } from '@campus-cloud/session';
import { Store } from '@ngrx/store';
import * as fromStore from '@campus-cloud/store';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { canSchoolReadResource } from '@campus-cloud/shared/utils';

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
    const ctPrivileges = [
      CP_PRIVILEGES_MAP.contact_trace_forms,
      CP_PRIVILEGES_MAP.contact_trace_qr,
      CP_PRIVILEGES_MAP.contact_trace_cases,
      CP_PRIVILEGES_MAP.contact_trace_exposure_notification,
      CP_PRIVILEGES_MAP.contact_trace_health_dashboard
    ];

    _children = this.privileges.children.filter((child) => {
      if (ctPrivileges.indexOf(child.privilege) !== -1) {
        return canSchoolReadResource(this.session.g, child.privilege) ? child : null;
      } else {
        let hasPrivilege = false;
        for (let i = 0; i < child.privilege.length; i++) {
          hasPrivilege = canSchoolReadResource(this.session.g, child.privilege[i]);
          if (hasPrivilege) {
            break;
          }
        }
        return hasPrivilege ? child : null;
      }
    });
    return Object.assign({}, this.privileges, { children: _children });
  }
}
