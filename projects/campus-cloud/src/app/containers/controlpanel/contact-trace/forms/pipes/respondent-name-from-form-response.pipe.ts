import { Pipe, PipeTransform } from '@angular/core';
import { FormResponse } from '@controlpanel/contact-trace/forms';

@Pipe({
  name: 'respondentNameFromFormResponse'
})
export class RespondentNameFromFormResponsePipe implements PipeTransform {

  transform(formResponse: FormResponse): string {
    if (formResponse) {
      if (formResponse.firstname && formResponse.lastname) {
        return `${formResponse.firstname} ${formResponse.lastname}`;
      } else if (formResponse.firstname && !formResponse.lastname) {
        return formResponse.firstname;
      } else if (!formResponse.firstname && formResponse.lastname) {
        return formResponse.lastname;
      }
    }
    return '';
  }

}
