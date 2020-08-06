import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsRoutingModule } from './forms.routing.module';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import {
  FormSearchResultTileComponent,
  FormsListActionBoxComponent,
  FormsListComponent
} from './list';
import { FormsModule } from '@angular/forms';
import {
  FormsCreateBuilderComponent,
  FormsCreateComponent,
  FormsCreateInfoComponent,
  FormsCreateResultsComponent,
  FormsCreateShareComponent,
  FormTemplateTileComponent
} from './create';
import {
  BlockBodyDecimalComponent,
  BlockBodyImageComponent,
  BlockBodyMultipleChoiceComponent,
  BlockBodyMultipleSelectionComponent,
  BlockBodyNumberComponent,
  BlockBodyResultComponent,
  BlockBodyTextComponent,
  BlockBodyWelcomeComponent,
  BlockLogicSkipToSelectorComponent,
  FormBlockBodyComponent,
  FormBlockComponent,
  FormBlockHeaderComponent,
  FormBlockImageSelectorComponent,
  FormBlockLogicComponent,
  FormBlockTypeSelectorComponent,
  FormDeleteComponent,
  FormPublishComponent,
  FormUnpublishComponent,
  SelectorForNumberComponent,
  SelectorForOptionsComponent,
  SelectorForResultComponent,
  SelectorForTextComponent
} from './components';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';

@NgModule({
  declarations: [
    FormsListComponent,
    FormsCreateComponent,
    FormsCreateInfoComponent,
    FormsCreateBuilderComponent,
    FormBlockComponent,
    FormBlockHeaderComponent,
    FormBlockTypeSelectorComponent,
    FormBlockBodyComponent,
    FormBlockImageSelectorComponent,
    BlockBodyMultipleChoiceComponent,
    BlockBodyWelcomeComponent,
    BlockBodyMultipleSelectionComponent,
    BlockBodyTextComponent,
    BlockBodyNumberComponent,
    BlockBodyDecimalComponent,
    BlockBodyImageComponent,
    BlockBodyResultComponent,
    FormBlockLogicComponent,
    BlockLogicSkipToSelectorComponent,
    SelectorForOptionsComponent,
    SelectorForTextComponent,
    SelectorForNumberComponent,
    FormsCreateShareComponent,
    FormsCreateResultsComponent,
    FormsListActionBoxComponent,
    FormTemplateTileComponent,
    FormSearchResultTileComponent,
    SelectorForResultComponent,
    FormDeleteComponent,
    FormUnpublishComponent,
    FormPublishComponent
  ],
  imports: [CommonModule, FormsRoutingModule, SharedModule, FormsModule, LayoutsModule],
  providers: [CPI18nPipe]
})
export class CTFormsModule {}
