// This is only used by the UI. The API does not support this.
import { LogicOperator, OperandType } from '@controlpanel/contact-trace/forms';

export interface BlockLogicRowItem {
  nextBlockIndex?: number;
  selectionsArray?: boolean[];
  arbitraryData?: string;
  arbitraryDataType?: OperandType;
  logicOp?: LogicOperator;
}
