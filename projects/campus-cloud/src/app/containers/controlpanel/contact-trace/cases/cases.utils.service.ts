import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
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
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import {
  CPDate,
  Formats,
  createSpreadSheet,
  compressFiles,
  privacyConfigurationOn
} from '@campus-cloud/shared/utils';
import { CPSession } from '@campus-cloud/session';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class CasesUtilsService {
  sourceActivityName: ISourceActivityName[];

  readonly fileDateSignature = CPDate.format(new Date(), 'YYYY_MM_DD_HHmm');

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

  defaultParams(state): HttpParams {
    return new HttpParams()
      .append('search_str', state.search_str)
      .append('current_status_ids', state.current_status_ids)
      .append('exclude_external', state.exclude_external)
      .append('start', state.start)
      .append('end', state.end)
      .append('school_id', this.session.g.get('school').id);
  }

  defaultParamsForCaseStatus(state): HttpParams {
    return new HttpParams()
      .append('search_str', state.search_str)
      .append('start', state.start)
      .append('end', state.end)
      .append('school_id', this.session.g.get('school').id);
  }

  getCaseForm(formData: ICase) {
    return this.fb.group({
      firstname: [formData ? formData.firstname : null, Validators.required],
      lastname: [formData ? formData.lastname : null, Validators.required],
      extern_user_id: [formData ? formData.extern_user_id : null, Validators.required],
      current_status_id: [
        formData && formData.current_status.id !== 0 ? formData.current_status.id : null,
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
            const tracedContactsCount = item.source_activity_name.substring(
              0,
              item.source_activity_name.indexOf('%') - 1
            );
            if (tracedContactsCount !== '0') {
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

  createCaseCSVData(cases, privacyOn: boolean = false) {
    const columns = !privacyOn
      ? [
          this.cpI18nPipe.transform('first_name'),
          this.cpI18nPipe.transform('last_name'),
          this.cpI18nPipe.transform('email'),
          this.cpI18nPipe.transform('student_id'),
          this.cpI18nPipe.transform('contact_trace_health_identifier'),
          this.cpI18nPipe.transform('contact_trace_case_id'),
          this.cpI18nPipe.transform('t_data_export_csv_walls_date_created'),
          this.cpI18nPipe.transform('t_case_status')
        ]
      : [
          this.cpI18nPipe.transform('contact_trace_health_identifier'),
          this.cpI18nPipe.transform('contact_trace_case_id'),
          this.cpI18nPipe.transform('t_data_export_csv_walls_date_created'),
          this.cpI18nPipe.transform('t_case_status')
        ];
    cases = cases.map((item) => {
      return !privacyOn
        ? {
            [this.cpI18nPipe.transform('first_name')]: item.firstname,

            [this.cpI18nPipe.transform('last_name')]: item.lastname,

            [this.cpI18nPipe.transform('email')]: item.extern_user_id,

            [this.cpI18nPipe.transform('student_id')]: item.student_id,

            [this.cpI18nPipe.transform(
              'contact_trace_health_identifier'
            )]: item.anonymous_identifier,

            [this.cpI18nPipe.transform('contact_trace_case_id')]: item.id,

            [this.cpI18nPipe.transform('t_data_export_csv_walls_date_created')]: CPDate.fromEpoch(
              item.date_last_modified,
              this.session.tz
            ).format(Formats.dateFormat),

            [this.cpI18nPipe.transform('t_case_status')]: item.current_status.name
          }
        : {
            [this.cpI18nPipe.transform(
              'contact_trace_health_identifier'
            )]: item.anonymous_identifier,

            [this.cpI18nPipe.transform('contact_trace_case_id')]: item.id,

            [this.cpI18nPipe.transform('t_data_export_csv_walls_date_created')]: CPDate.fromEpoch(
              item.date_last_modified,
              this.session.tz
            ).format(Formats.dateFormat),

            [this.cpI18nPipe.transform('t_case_status')]: item.current_status.name
          };
    });

    return { columns: columns, data: cases };
  }

  createCaseStatsCSVData(cases, caseStatuses, privacyOn: boolean = false) {
    const columnNames = {
      date: this.cpI18nPipe.transform('t_data_export_csv_walls_date_created'),
      firstName: this.cpI18nPipe.transform('first_name'),
      lastName: this.cpI18nPipe.transform('last_name'),
      email: this.cpI18nPipe.transform('email'),
      studentId: this.cpI18nPipe.transform('student_id'),
      healthIdentifier: this.cpI18nPipe.transform('contact_trace_health_identifier'),
      caseId: this.cpI18nPipe.transform('contact_trace_case_id'),
      caseStatus: this.cpI18nPipe.transform('t_case_status')
    };

    const columns = !privacyOn
      ? [
          columnNames.date,
          columnNames.firstName,
          columnNames.lastName,
          columnNames.email,
          columnNames.studentId,
          columnNames.healthIdentifier,
          columnNames.caseId,
          columnNames.caseStatus
        ]
      : [
          columnNames.date,
          columnNames.healthIdentifier,
          columnNames.caseId,
          columnNames.caseStatus
        ];

    const caseStatusMapping = {};
    caseStatuses.forEach((caseStatus) => {
      caseStatusMapping[caseStatus.id] = caseStatus.name;
    });

    cases = cases.map((item) => {
      return !privacyOn
        ? {
            [columnNames.date]: CPDate.fromEpoch(item.day_start_epoch, this.session.tz).format(
              Formats.dateFormat
            ),
            [columnNames.firstName]: item.firstname,
            [columnNames.lastName]: item.lastname,
            [columnNames.email]: item.extern_user_id,
            [columnNames.studentId]: item.student_id,
            [columnNames.healthIdentifier]: item.anonymous_identifier,
            [columnNames.caseId]: item.case_id,
            [columnNames.caseStatus]: caseStatusMapping[item.case_status_id]
          }
        : {
            [columnNames.date]: CPDate.fromEpoch(item.day_start_epoch, this.session.tz).format(
              Formats.dateFormat
            ),
            [columnNames.healthIdentifier]: item.anonymous_identifier,
            [columnNames.caseId]: item.case_id,
            [columnNames.caseStatus]: caseStatusMapping[item.case_status_id]
          };
    });

    return { columns: columns, data: cases };
  }

  createCaseActivityCSVData(caseActivities, privacyOn: boolean = false) {
    const columns = !privacyOn
      ? [
          this.cpI18nPipe.transform('first_name'),
          this.cpI18nPipe.transform('last_name'),
          this.cpI18nPipe.transform('email'),
          this.cpI18nPipe.transform('student_id'),
          this.cpI18nPipe.transform('contact_trace_health_identifier'),
          this.cpI18nPipe.transform('contact_trace_case_id'),
          this.cpI18nPipe.transform('t_data_export_csv_walls_date_created'),
          this.cpI18nPipe.transform('event'),
          this.cpI18nPipe.transform('t_case_status'),
          this.cpI18nPipe.transform('t_shared_source')
        ]
      : [
          this.cpI18nPipe.transform('contact_trace_health_identifier'),
          this.cpI18nPipe.transform('contact_trace_case_id'),
          this.cpI18nPipe.transform('t_data_export_csv_walls_date_created'),
          this.cpI18nPipe.transform('event'),
          this.cpI18nPipe.transform('t_case_status'),
          this.cpI18nPipe.transform('t_shared_source')
        ];

    caseActivities = caseActivities.map((item) => {
      return !privacyOn
        ? {
            [this.cpI18nPipe.transform('first_name')]: item.firstname,

            [this.cpI18nPipe.transform('last_name')]: item.lastname,

            [this.cpI18nPipe.transform('email')]: item.extern_user_id,

            [this.cpI18nPipe.transform('student_id')]: item.student_id,

            [this.cpI18nPipe.transform(
              'contact_trace_health_identifier'
            )]: item.anonymous_identifier,

            [this.cpI18nPipe.transform('contact_trace_case_id')]: item.case_id,

            [this.cpI18nPipe.transform('t_data_export_csv_walls_date_created')]: CPDate.fromEpoch(
              item.activity_time_epoch,
              this.session.tz
            ).format(Formats.dateFormat),

            [this.cpI18nPipe.transform('event')]: item.event,

            [this.cpI18nPipe.transform('t_case_status')]: item.new_status.name,

            [this.cpI18nPipe.transform('t_shared_source')]: item.source
          }
        : {
            [this.cpI18nPipe.transform(
              'contact_trace_health_identifier'
            )]: item.anonymous_identifier,

            [this.cpI18nPipe.transform('contact_trace_case_id')]: item.case_id,

            [this.cpI18nPipe.transform('t_data_export_csv_walls_date_created')]: CPDate.fromEpoch(
              item.activity_time_epoch,
              this.session.tz
            ).format(Formats.dateFormat),

            [this.cpI18nPipe.transform('event')]: item.event,

            [this.cpI18nPipe.transform('t_case_status')]: item.new_status.name,

            [this.cpI18nPipe.transform('t_shared_source')]: item.source
          };
    });

    return { columns: columns, data: caseActivities };
  }

  exportCaseActivities(caseActivities) {
    const csvData = this.createCaseActivityCSVData(
      caseActivities,
      privacyConfigurationOn(this.session.g)
    );
    createSpreadSheet(csvData.data, csvData.columns);
  }

  generateCSV(columns: string[], data: any[]) {
    return createSpreadSheet(data, columns, 'file', false);
  }

  exportUserCases(cases, isPrivacyOn) {
    const caseData = this.createCaseCSVData(cases, isPrivacyOn);
    createSpreadSheet(caseData.data, caseData.columns);
  }

  exportCaseStats(cases, caseStatuses) {
    const caseData = this.createCaseStatsCSVData(
      cases,
      caseStatuses,
      privacyConfigurationOn(this.session.g)
    );
    createSpreadSheet(caseData.data, caseData.columns);
  }

  async exportCases(cases, caseActivities) {
    const caseData = this.createCaseCSVData(cases, privacyConfigurationOn(this.session.g));
    const caseActivityData = this.createCaseActivityCSVData(
      caseActivities,
      privacyConfigurationOn(this.session.g)
    );
    const files = [
      {
        name: `CASE_${this.fileDateSignature}`,
        content: this.generateCSV(caseData.columns, caseData.data)
      },
      {
        name: `CASE_ACTIVITY_${this.fileDateSignature}`,
        content: this.generateCSV(caseActivityData.columns, caseActivityData.data)
      }
    ];

    const content = await compressFiles(files);
    saveAs(content, `CASES_${this.fileDateSignature}.zip`);
  }

  filterCaseBody(updatedCase: any, isPrivacyOn = false) {
    if (isPrivacyOn) {
      const {
        ['firstname']: firstname,
        ['lastname']: lastname,
        ['extern_user_id']: externalUserId,
        ...privacyUpdatedCase
      } = updatedCase;
      return privacyUpdatedCase;
    }
    return updatedCase;
  }
}
