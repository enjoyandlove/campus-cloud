import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TextModule } from '../../text/text.module';
import { ResultItemComponent } from './result-item/result-item.component';
import { ResultsListComponent } from './results-list/results-list.component';
import { SpinnerModule } from '../../feedback-and-indicators/spinner/spinner.module';
import { ResultsListSectionComponent } from './results-list-section/results-list-section.component';

@NgModule({
  exports: [ResultsListComponent, ResultItemComponent, ResultsListSectionComponent],
  declarations: [ResultsListComponent, ResultItemComponent, ResultsListSectionComponent],
  imports: [CommonModule, TextModule, SpinnerModule, A11yModule]
})
export class ResultsListModule {}
