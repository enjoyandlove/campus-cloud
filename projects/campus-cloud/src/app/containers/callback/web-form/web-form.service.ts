// import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '@campus-cloud/base/services';
import { FileUploadService } from '@campus-cloud/shared/services';
import { CallbackService } from '../callback.service';
import { FormBlockResponse } from './form-block.interface';

@Injectable()
export class WebFormService {
  constructor(
    public api: ApiService,
    public http: HttpClient,
    public callBackService: CallbackService,
    private fileUploadService: FileUploadService
  ) {}

  getForm(formId: string) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.NON_SESSION_WEB_FORM}/${formId}`;
    return this.api.get(url, null, true);
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

  uploadImage(relatedObjType: number = 7, relatedObjId: number, file: any) {
    const query = `?related_obj_type=${relatedObjType}&related_obj_id=${relatedObjId}`;
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.NON_SESSION_IMAGE}/${query}`;

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      Authorization: `CCToke ${this.api.KEY}`
    });

    return this.http.post(url, formData, {
      headers
    });
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
