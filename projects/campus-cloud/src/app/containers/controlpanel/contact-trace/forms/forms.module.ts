import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsRoutingModule } from './forms.routing.module';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { FormsModule } from '@angular/forms';
import {
  FormSearchResultTileComponent,
  FormsListActionBoxComponent,
  FormsListComponent,
  FormResponseTileComponent,
  FormsCreateBuilderComponent,
  FormsCreateComponent,
  FormsCreateInfoComponent,
  FormsCreateResultsComponent,
  FormsCreateShareComponent,
  FormTemplateTileComponent,
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
  SelectorForTextComponent,
  FormsRespondentResponseComponent,
  RespondentNameFromFormResponsePipe,
  RespondentBlockResponsesDisplayComponent,
  CollectionMethodCodeToDisplayStringPipe
} from './';
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
    FormPublishComponent,
    FormResponseTileComponent,
    FormsRespondentResponseComponent,
    RespondentNameFromFormResponsePipe,
    RespondentBlockResponsesDisplayComponent,
    CollectionMethodCodeToDisplayStringPipe
  ],
  imports: [CommonModule, FormsRoutingModule, SharedModule, FormsModule, LayoutsModule],
  providers: [CPI18nPipe]
})
export class CTFormsModule {}
