import { createFeatureSelector } from '@ngrx/store';

import { IAPIManagementState } from '../../model';

export const getFeatureState = createFeatureSelector<IAPIManagementState>('apiManagement');
