import { LogicOperator, OperandType } from '.';

export interface BlockLogic {
  id?: number;
  logic_op?: LogicOperator;
  next_block_index?: number;
  block_content_index?: number;
  arbitrary_data?: string;
  arbitrary_data_type?: OperandType;
  block_content_id?: number;
  next_block_id?: number;
}
