import { createFeatureSelector } from '@ngrx/store';

import { IAPIManagementState } from '../../api-management.interface';

export const getFeatureState = createFeatureSelector<IAPIManagementState>('apiManagement');
