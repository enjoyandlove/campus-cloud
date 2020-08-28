import { ICaseStatus } from '@controlpanel/contact-trace/cases/cases.interface';
import { createReducer, on } from '@ngrx/store';
import { ExposureNotificationPageActions } from '@controlpanel/contact-trace/exposure-notification/store/actions';


export interface ExposureNotificationState {
  selectedCaseStatus: string;
  caseStatus: ICaseStatus;
}

export const exposureNotificationInitialState: ExposureNotificationState = {
  selectedCaseStatus: null,
  caseStatus: null
};

export const exposureNotificationReducer = createReducer(
  exposureNotificationInitialState,
  on(ExposureNotificationPageActions.selectCaseStatus, (state) => {
    return {
      ...state
    };
  })
);
