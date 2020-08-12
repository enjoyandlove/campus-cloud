import { Component, Input, OnInit } from '@angular/core';
import { BlockLogicRowItem, FormBlock } from '@controlpanel/contact-trace/forms/models';

@Component({
  selector: 'cp-selector-for-options',
  templateUrl: './selector-for-options.component.html',
  styleUrls: ['./selector-for-options.component.scss']
})
export class SelectorForOptionsComponent implements OnInit {
  @Input() formBlock: FormBlock;
  @Input() highlightFormError: boolean;
  @Input() blockLogicRow: BlockLogicRowItem;

  constructor() {}

  ngOnInit(): void {}

  blockContentClickHandler(index: number): void {
    this.blockLogicRow.selectionsArray[index] = !this.blockLogicRow.selectionsArray[index];
  }

  isIndexSelected(index: number): boolean {
    return !!this.blockLogicRow.selectionsArray[index];
  }

  getAlphabetForNumber(num: number): string {
    return String.fromCharCode(num + 96);
  }

  highlightError(): boolean {
    const atLeastOneSelected: boolean =
      this.blockLogicRow.selectionsArray.filter((sel) => sel).length > 0;
    return this.highlightFormError && !atLeastOneSelected;
  }
}
