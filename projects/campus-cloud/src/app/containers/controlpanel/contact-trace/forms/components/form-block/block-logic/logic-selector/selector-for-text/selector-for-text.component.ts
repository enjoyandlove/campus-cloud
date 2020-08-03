import { Component, Input, OnInit } from '@angular/core';
import { FormBlock, LogicOperator } from '../../../../../models';

@Component({
  selector: 'cp-selector-for-text',
  templateUrl: './selector-for-text.component.html',
  styleUrls: ['./selector-for-text.component.scss']
})
export class SelectorForTextComponent implements OnInit {
  @Input() formBlock: FormBlock;
  @Input() highlightFormError: boolean;
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
      (!this.formBlock.block_logic_list[0].arbitrary_data ||
        this.formBlock.block_logic_list[0].arbitrary_data.trim().length === 0)
    );
  }
}
