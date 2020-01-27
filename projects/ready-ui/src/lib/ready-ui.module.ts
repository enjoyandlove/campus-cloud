import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TextModule } from './text/text.module';
import { FormsModule } from './forms/forms.module';
import { ChartsModule } from './charts/charts.module';
import { ActionsModule } from './actions/actions.module';
import { OverlaysModule } from './overlays/overlays.module';
import { StructureModule } from './structure/structure.module';
import { ImagesAndIconsModule } from './images-and-icons/images-and-icons.module';
import { ListsAndTablesModule } from './lists-and-tables/lists-and-tables.module';
import { FeedbackAndIndicatorsModule } from './feedback-and-indicators/feedback-and-indicators.module';

@NgModule({
  exports: [
    TextModule,
    FormsModule,
    ChartsModule,
    ActionsModule,
    OverlaysModule,
    StructureModule,
    ImagesAndIconsModule,
    ListsAndTablesModule,
    FeedbackAndIndicatorsModule
  ],
  declarations: [],
  imports: [CommonModule]
})
export class ReadyUiModule {}
