import { BlockContent, BlockLogic, BlockLogicRowItem } from '.';

export interface FormBlock {
  id?: number;
  block_type?: number;
  name?: string;
  text?: string;
  hint_text?: string;
  image_url?: string;
  is_required?: boolean;
  is_terminal?: boolean;
  default_next_form_block_id?: number;
  extra_info?: string;
  block_content_list?: BlockContent[];
  block_logic_list?: BlockLogic[];

  // This is an attribute that is only used by the UI. The API does not support this attribute.
  blockLogicRows?: BlockLogicRowItem[];
}
