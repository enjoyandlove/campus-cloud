import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TextModule } from './text/text.module';
import { ChartsModule } from './charts/charts.module';
import { ReadyFormsModule } from './forms/forms.module';
import { ActionsModule } from './actions/actions.module';
import { BehaviorModule } from './behavior/behavior.module';
import { OverlaysModule } from './overlays/overlays.module';
import { StructureModule } from './structure/structure.module';
import { NavigationModule } from './navigation/navigation.module';
import { ImagesAndIconsModule } from './images-and-icons/images-and-icons.module';
import { ListsAndTablesModule } from './lists-and-tables/lists-and-tables.module';
import { FeedbackAndIndicatorsModule } from './feedback-and-indicators/feedback-and-indicators.module';

@NgModule({
  exports: [
    TextModule,
    ChartsModule,
    ActionsModule,
    OverlaysModule,
    StructureModule,
    ReadyFormsModule,
    NavigationModule,
    ImagesAndIconsModule,
    ListsAndTablesModule,
    FeedbackAndIndicatorsModule
  ],
  declarations: [],
  imports: [CommonModule]
})
export class ReadyUiModule {}
