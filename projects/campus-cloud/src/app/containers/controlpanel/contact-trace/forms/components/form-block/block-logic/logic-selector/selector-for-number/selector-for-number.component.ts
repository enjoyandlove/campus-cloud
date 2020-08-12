import { Component, Input, OnInit } from '@angular/core';
import { BlockLogicRowItem, BlockType, FormBlock, LogicOperator } from '../../../../../models';

@Component({
  selector: 'cp-selector-for-number',
  templateUrl: './selector-for-number.component.html',
  styleUrls: ['./selector-for-number.component.scss']
})
export class SelectorForNumberComponent implements OnInit {
  @Input() highlightFormError: boolean;
  @Input() blockLogicRow: BlockLogicRowItem;
  @Input() formBlock: FormBlock;
  logicOperatorToTextMap = {
    [LogicOperator.equal]: 'contact_trace_forms_if_equals',
    [LogicOperator.not_equal]: 'contact_trace_forms_if_not_equals',
    [LogicOperator.greater_than]: 'contact_trace_forms_if_greater_than',
    [LogicOperator.greater_than_or_equal]: 'contact_trace_forms_if_greater_than_or_equal',
    [LogicOperator.less_than]: 'contact_trace_forms_if_less_than',
    [LogicOperator.less_than_or_equal]: 'contact_trace_forms_if_less_than_or_equal'
  };
  availableLogicOperators: LogicOperator[] = [
    LogicOperator.equal,
    LogicOperator.not_equal,
    LogicOperator.greater_than,
    LogicOperator.greater_than_or_equal,
    LogicOperator.less_than,
    LogicOperator.less_than_or_equal
  ];
  logicText: string;

  constructor() {}

  ngOnInit(): void {
    this.logicText = this.blockLogicRow.arbitraryData;
  }

  highlightError(): boolean {
    return (
      this.highlightFormError &&
      (!this.blockLogicRow.arbitraryData || this.blockLogicRow.arbitraryData.trim().length === 0)
    );
  }

  validateInput(): void {
    let matcher;
    if (this.formBlock.block_type === BlockType.number) {
      matcher = /^[0-9]*$/;
    } else if (this.formBlock.block_type === BlockType.decimal) {
      matcher = /^\d*\.?\d*$/;
    }
    if ((this.logicText ? this.logicText : '').match(matcher)) {
      this.blockLogicRow.arbitraryData = this.logicText;
    } else {
      this.logicText = this.blockLogicRow.arbitraryData;
    }
  }
}
