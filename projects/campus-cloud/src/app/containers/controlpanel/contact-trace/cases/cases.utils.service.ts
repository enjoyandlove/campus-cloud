import { Injectable } from '@angular/core';
import {
  ICase,
  ICaseStatus,
  ICaseLog,
  ISourceActivityName,
  SourceActivityType,
  SourceType
} from './cases.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { getItem } from '@campus-cloud/shared/components';
import { CPI18nPipe } from '@projects/campus-cloud/src/app/shared/pipes';
import { CPDate, Formats, createSpreadSheet } from '@campus-cloud/shared/utils';
import { CPSession } from '@projects/campus-cloud/src/app/session';

@Injectable()
export class CasesUtilsService {
  sourceActivityName: ISourceActivityName[];
  constructor(public fb: FormBuilder, public cpI18nPipe: CPI18nPipe, public session: CPSession) {
    this.sourceActivityName = [
      {
        tag: '%creation%',
        name: cpI18nPipe.transform('case_event_creation'),
        source: cpI18nPipe.transform('case_source_creation')
      },
      {
        tag: '%manual_notes%',
        name: cpI18nPipe.transform('case_event_manual_notes'),
        source: cpI18nPipe.transform('notes')
      },
      {
        tag: '%manual_status%',
        name: cpI18nPipe.transform('case_event_manual_status'),
        source: cpI18nPipe.transform('case_source_manual_status')
      },
      {
        tag: '%action_notify%',
        name: cpI18nPipe.transform('case_event_action_notify'),
        source: ''
      },
      {
        tag: '%action_contact_trace%',
        name: cpI18nPipe.transform('case_event_action_contact_trace'),
        source: ''
      },
      {
        tag: '%exposure_alert%',
        name: cpI18nPipe.transform('case_event_exposure_alert'),
        source: cpI18nPipe.transform('contact_trace_notification_case')
      }
    ];
  }

  getCaseForm(formData: ICase) {
    return this.fb.group({
      firstname: [formData ? formData.firstname : null, Validators.required],
      lastname: [formData ? formData.lastname : null, Validators.required],
      extern_user_id: [formData ? formData.extern_user_id : null, Validators.required],
      current_status_id: [
        formData && formData.current_status.id != 0 ? formData.current_status.id : null,
        Validators.required
      ]
    });
  }

  parsedEventProperties(data) {
    const extern_user_id = data.extern_user_id ? amplitudeEvents.YES : amplitudeEvents.NO;
    const firstname = data.firstname ? amplitudeEvents.YES : amplitudeEvents.NO;
    const lastname = data.lastname ? amplitudeEvents.YES : amplitudeEvents.NO;
    const current_status_id = data.current_status_id ? amplitudeEvents.YES : amplitudeEvents.NO;

    return {
      extern_user_id,
      firstname,
      lastname,
      current_status_id
    };
  }

  public getCaseStatusOptions(status: ICaseStatus[], label?: string) {
    const heading = [
      {
        label,
        action: 0
      }
    ];

    const _heading = label ? heading : [];

    const _statuses = status.map((item: ICaseStatus) => {
      return getItem(item, 'name', 'id');
    });

    return [..._heading, ..._statuses];
  }

  public serializeCaseLog(res) {
    const caseLog: ICaseLog[] = res.map((item) => {
      const newItem = { ...item, event: '', source: '' };
      const matchedSource = this.sourceActivityName.filter((name) => {
        return item.source_activity_name.includes(name.tag);
      })[0];
      if (matchedSource) {
        switch (matchedSource.tag) {
          case this.sourceActivityName[SourceActivityType.Creation].tag:
            newItem.event = item.source_activity_name.replace(
              matchedSource.tag,
              this.sourceActivityName[SourceActivityType.Creation].name
            );
            newItem.source = this.sourceActivityName[SourceActivityType.Creation].source;
            break;
          case this.sourceActivityName[SourceActivityType.ManualNotes].tag:
            newItem.event = matchedSource.name;
            newItem.source = matchedSource.source;
            break;
          case this.sourceActivityName[SourceActivityType.ManualStatus].tag:
            newItem.event = item.source_activity_name.replace(
              matchedSource.tag,
              matchedSource.name
            );
            if (item.source_type === SourceType.Admin) {
              newItem.source = `${matchedSource.source} ${item.admin_name}`;
            } else {
              newItem.source = this.cpI18nPipe.transform('case_source_automatic_escalated');
            }
            break;
          case this.sourceActivityName[SourceActivityType.ActionNotify].tag:
            newItem.event = item.source_activity_name.replace(
              matchedSource.tag,
              matchedSource.name
            );
            newItem.source = '';
            break;
          case this.sourceActivityName[SourceActivityType.ActionContactTrace].tag:
            newItem.event = item.source_activity_name.replace(
              matchedSource.tag,
              matchedSource.name
            );
            let tracedContactsCount = item.source_activity_name.substring(
              0,
              item.source_activity_name.indexOf('%') - 1
            );
            if (tracedContactsCount != '0') {
              newItem.source = tracedContactsCount;
            }
            break;
          case this.sourceActivityName[SourceActivityType.ExposureAlerts].tag:
            newItem.event = item.source_activity_name.replace(
              matchedSource.tag,
              matchedSource.name
            );
            newItem.source = `${matchedSource.source} ${item.source_obj_id}`;
            break;
        }
      } else {
        newItem.event = item.source_activity_name;
        if (item.form_name) {
          newItem.source = item.form_name;
        }
      }
      return newItem;
    });
    return caseLog;
  }

  exportCases(cases) {
    let columns = [
      this.cpI18nPipe.transform('first_name'),
      this.cpI18nPipe.transform('last_name'),
      this.cpI18nPipe.transform('email'),
      this.cpI18nPipe.transform('student_id'),
      this.cpI18nPipe.transform('t_data_export_csv_walls_date_created'),
      this.cpI18nPipe.transform('t_case_status')
    ];

    cases = cases.map((item) => {
      return {
        [this.cpI18nPipe.transform('first_name')]: item.firstname,

        [this.cpI18nPipe.transform('last_name')]: item.lastname,

        [this.cpI18nPipe.transform('email')]: item.extern_user_id,

        [this.cpI18nPipe.transform('student_id')]: item.student_id,

        [this.cpI18nPipe.transform('t_data_export_csv_walls_date_created')]: CPDate.fromEpoch(
          item.date_last_modified,
          this.session.tz
        ).format(Formats.dateFormat),

        [this.cpI18nPipe.transform('t_case_status')]: item.current_status.name
      };
    });
    createSpreadSheet(cases, columns);
  }

  exportCaseActivity(currentCase, caseActivities) {
    let columns = [
      this.cpI18nPipe.transform('first_name'),
      this.cpI18nPipe.transform('last_name'),
      this.cpI18nPipe.transform('email'),
      this.cpI18nPipe.transform('student_id'),
      this.cpI18nPipe.transform('t_data_export_csv_walls_date_created'),
      this.cpI18nPipe.transform('event'),
      this.cpI18nPipe.transform('t_case_status'),
      this.cpI18nPipe.transform('t_shared_source')
    ];

    caseActivities = caseActivities.map((item) => {
      return {
        [this.cpI18nPipe.transform('first_name')]: currentCase.firstname,

        [this.cpI18nPipe.transform('last_name')]: currentCase.lastname,

        [this.cpI18nPipe.transform('email')]: currentCase.extern_user_id,

        [this.cpI18nPipe.transform('student_id')]: item.student_id,

        [this.cpI18nPipe.transform('t_data_export_csv_walls_date_created')]: CPDate.fromEpoch(
          item.activity_time_epoch,
          this.session.tz
        ).format(Formats.dateFormat),

        [this.cpI18nPipe.transform('event')]: item.event,

        [this.cpI18nPipe.transform('t_case_status')]: item.new_status.name,

        [this.cpI18nPipe.transform('t_shared_source')]: item.source
      };
    });
    createSpreadSheet(caseActivities, columns);
  }
}
