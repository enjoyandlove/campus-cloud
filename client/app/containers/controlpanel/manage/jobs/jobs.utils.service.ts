/*tslint:disable:max-line-length*/
import { Injectable } from '@angular/core';

import { CPI18nService } from '../../../../shared/services';

@Injectable()
export class JobsUtilsService {
  constructor(
    public cpI18n: CPI18nService,
  ) {
    Object.setPrototypeOf(this, JobsUtilsService.prototype);
  }

  getDesiredStudy(
    all: boolean = null,
    is_ug_y1: boolean = null,
    is_ug_y2: boolean = null,
    is_ug_y3: boolean = null,
    is_ug_y4: boolean = null,
    is_masters: boolean = null,
    is_phd: boolean = null
  ) {
    let desireStudy = [];

    if (is_phd || all) {
      desireStudy = [
        { name: 'is_phd', label: this.cpI18n.translate('jobs_desired_study_phd') },
        ...desireStudy
      ];
    }

    if (is_masters || all) {
      desireStudy = [
        { name: 'is_masters', label: this.cpI18n.translate('jobs_desired_study_masters') },
        ...desireStudy
      ];
    }

    if (is_ug_y4 || all) {
      desireStudy = [
        { name: 'is_ug_y4', label: this.cpI18n.translate('jobs_desired_study_ug_y4') },
        ...desireStudy
      ];
    }

    if (is_ug_y3 || all) {
      desireStudy = [
        { name: 'is_ug_y3', label: this.cpI18n.translate('jobs_desired_study_ug_y3') },
        ...desireStudy
      ];
    }

    if (is_ug_y2 || all) {
      desireStudy = [
        { name: 'is_ug_y2', label: this.cpI18n.translate('jobs_desired_study_ug_y2') },
        ...desireStudy
      ];
    }

    if (is_ug_y1 || all) {
      desireStudy = [
        { name: 'is_ug_y1', label: this.cpI18n.translate('jobs_desired_study_ug_y1') },
        ...desireStudy
      ];
    }

    return desireStudy;
  }

  getJobsType(
    all: boolean = null,
    is_full_time: boolean = null,
    is_part_time: boolean = null,
    is_internship: boolean = null,
    is_summer: boolean = null,
    is_credited: boolean = null,
    is_volunteer: boolean = null,
    is_oncampus: boolean = null
  ) {
    let jobTypes = [];

    if (is_volunteer || all) {
      jobTypes = [
        { name: 'is_volunteer', label: this.cpI18n.translate('jobs_job_type_volunteer') },
        ...jobTypes
      ];
    }

    if (is_credited || all) {
      jobTypes = [
        { name: 'is_credited', label: this.cpI18n.translate('jobs_job_type_for_credit') },
        ...jobTypes
      ];
    }

    if (is_oncampus || all) {
      jobTypes = [
        { name: 'is_oncampus', label: this.cpI18n.translate('jobs_job_type_on_campus') },
        ...jobTypes
      ];
    }

    if (is_summer || all) {
      jobTypes = [
        { name: 'is_summer', label: this.cpI18n.translate('jobs_job_type_summer') },
        ...jobTypes
      ];
    }

    if (is_internship || all) {
      jobTypes = [
        { name: 'is_internship', label: this.cpI18n.translate('jobs_job_type_internship') },
        ...jobTypes
      ];
    }

    if (is_part_time || all) {
      jobTypes = [
        { name: 'is_part_time', label: this.cpI18n.translate('jobs_job_type_part_time') },
        ...jobTypes
      ];
    }

    if (is_full_time || all) {
      jobTypes = [
        { name: 'is_full_time', label: this.cpI18n.translate('jobs_job_type_full_time') },
        ...jobTypes
      ];
    }

    return jobTypes;
  }
}
