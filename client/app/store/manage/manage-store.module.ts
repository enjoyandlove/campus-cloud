import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';

import * as fromDeals from './deals';
import { DealsService } from '../../containers/controlpanel/manage/deals/deals.service';
import { DealsStoreService } from '../../containers/controlpanel/manage/deals/stores/store.service';

export interface IManageState {
  deals: fromDeals.IDealsState;
}

const reducers: ActionReducerMap<IManageState> = {
  deals: fromDeals.reducer
};

const effects: any[] = [fromDeals.DealsEffects];

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('manage', reducers),
    EffectsModule.forFeature(effects)
  ],
  providers: [DealsService, DealsStoreService]
})
export class ManageStoreModule {}
