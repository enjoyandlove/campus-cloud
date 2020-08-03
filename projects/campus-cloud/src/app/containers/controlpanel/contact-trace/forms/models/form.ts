import { FormBlock } from '.';

export interface Form {
  id?: number;
  name?: string;
  description?: string;
  is_confirmation_required?: boolean;
  form_block_list?: FormBlock[];
  init_form_block_id?: number;
  template_form_id?: number;
  form_type?: number;
  is_published?: boolean;
  open_from_epoch?: number;
  open_until_epoch?: number;
  allow_web_collection?: boolean;
  allow_app_collection?: boolean;
  auth_requirement?: number;
  user_response_limit?: number;
  ver_required?: number;
  date_created?: number;
  date_last_modified?: number;
  school_id?: number;
  daily_reminder_enabled?: boolean;

  // hidden_field_data?: any;
  // user_response_count?: number;
}
