// import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@campus-cloud/base/services';
import { FormBlockResponse } from './form-block.interface';

@Injectable()
export class WebFormService {
  constructor(public api: ApiService) {}

  getForm(formId: string) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.NON_SESSION_WEB_FORM}/${formId}`;
    return this.api.get(url);
  }

  getNextFormBlock(
    formId: string,
    currentId: number,
    responseFormBlockContentIds: string = '',
    responseData: string = ''
  ) {
    // Handle optional queries
    const responseFormBlockContentIdsQuery =
      responseFormBlockContentIds === ''
        ? ''
        : `&response_form_block_content_ids=${responseFormBlockContentIds}`;
    const responseDataQuery = responseData === '' ? '' : `&response_data=${responseData}`;

    // Create the query
    const query = `?form_id=${formId}&current_id=${currentId}${responseFormBlockContentIdsQuery}${responseDataQuery}`;
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.NON_SESSION_FORM_BLOCK}/${query}`;

    return this.api.get(url);
  }

  createForm(formId: string, externalUserId: string) {
    const data = {
      form_id: formId,
      extern_user_id: externalUserId
    };
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.NON_SESSION_WEB_FORM_RESPONSE}/`;

    return this.api.post(url, data);
  }

  submit(formResponseId: number, externalUserId: string, data: FormBlockResponse[]) {
    const query = `?form_response_id=${formResponseId}&extern_user_id=${externalUserId}`;
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.NON_SESSION_FORM_BLOCK_RESPONSE}/${query}`;

    return this.api.post(url, data);
  }
}
