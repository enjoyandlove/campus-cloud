import { HttpParams } from '@angular/common/http';

import IServiceProvider from '../../providers.interface';

export function mkSearch(all: string, provider: IServiceProvider): HttpParams {
  return new HttpParams()
    .append('all', all)
    .append('service_id', provider.campus_service_id.toString())
    .append('service_provider_id', provider.id.toString());
}
