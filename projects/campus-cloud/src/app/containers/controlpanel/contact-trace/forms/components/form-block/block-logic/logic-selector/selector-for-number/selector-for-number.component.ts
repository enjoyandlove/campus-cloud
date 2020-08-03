import { Component, Input, OnInit } from '@angular/core';
import { FormBlock, LogicOperator } from '@controlpanel/contact-trace/forms/models';

@Component({
  selector: 'cp-selector-for-number',
  templateUrl: './selector-for-number.component.html',
  styleUrls: ['./selector-for-number.component.scss']
})
export class SelectorForNumberComponent implements OnInit {
  @Input() formBlock: FormBlock;
  @Input() highlightFormError: boolean;
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

  constructor() {}

  ngOnInit(): void {}

  highlightError(): boolean {
    return (
      this.highlightFormError &&
      (!this.formBlock.block_logic_list[0].arbitrary_data ||
        this.formBlock.block_logic_list[0].arbitrary_data.trim().length === 0)
    );
  }
}
