import { Component, Input, OnInit } from '@angular/core';
import { BlockLogicRowItem, LogicOperator } from '../../../../../models';

@Component({
  selector: 'cp-selector-for-text',
  templateUrl: './selector-for-text.component.html',
  styleUrls: ['./selector-for-text.component.scss']
})
export class SelectorForTextComponent implements OnInit {
  @Input() highlightFormError: boolean;
  @Input() blockLogicRow: BlockLogicRowItem;
  logicOperatorToTextMap = {
    [LogicOperator.equal]: 'contact_trace_forms_if_equals',
    [LogicOperator.not_equal]: 'contact_trace_forms_if_not_equals'
  };
  availableLogicOperators: LogicOperator[] = [LogicOperator.equal, LogicOperator.not_equal];

  constructor() {}

  ngOnInit(): void {}

  highlightError(): boolean {
    return (
      this.highlightFormError &&
      (!this.blockLogicRow.arbitraryData || this.blockLogicRow.arbitraryData.trim().length === 0)
    );
  }
}
