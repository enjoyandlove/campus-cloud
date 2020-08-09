import { CollectionMethod, FormBlockResponse } from '.';

export interface FormResponse {
  id?: number;
  form_id?: number;
  collection_method?: CollectionMethod;
  terminal_form_block_id?: number;
  response_started_epoch?: number;
  response_last_modified_epoch?: number;
  response_completed_epoch?: number;
  user_id?: number;
  email?: string;
  firstname?: string;
  lastname?: string;
  extern_user_id?: string;
  form_block_response_list?: FormBlockResponse[];
}
