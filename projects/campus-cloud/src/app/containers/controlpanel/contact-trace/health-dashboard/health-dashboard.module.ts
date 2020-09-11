import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { HealthDashboardComponent } from './health-dashboard.component';
import { HealthPassRoutingModule } from './health-dashboard.routing.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DashboardEffects } from './store/effects';
import * as fromDashboard from './store/reducers';
import { CasesService } from '../cases/cases.service';

@NgModule({
  declarations: [
    HealthDashboardComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HealthPassRoutingModule,
    EffectsModule.forFeature([DashboardEffects]),
    StoreModule.forFeature('healthDashboard', fromDashboard.reducer)
  ],
  providers: [CasesService]
})
export class HealthDashboardModule {}
