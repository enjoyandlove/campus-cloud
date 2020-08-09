import { FormBlockResponse } from './form-block.interface';

export interface FormState {
  formResponseId: number;
  externalUserId: string;
  formBlockResponses: FormBlockResponse[];
}
