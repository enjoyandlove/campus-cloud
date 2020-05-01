import { HttpParams } from '@angular/common/http';
import { ApiService } from '@campus-cloud/base';
import { tap } from 'rxjs/internal/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

import {
  IDataExport,
  DataExportType,
  IDataExportAppUsers,
  dataExportAmplitudeMap
} from './data-export.interface';
import { CPSession } from '@campus-cloud/session';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { DataExportUtilsService } from './data-export.utils.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';

@Injectable({
  providedIn: 'root'
})
export class DataExportService {
  constructor(
    private api: ApiService,
    private session: CPSession,
    private cpTracking: CPTrackingService,
    private exportDataUtils: DataExportUtilsService
  ) {}

  getAppUsers(params: HttpParams): Observable<IDataExportAppUsers[]> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EXPORT_DATA_APP_USERS_POST}/`;

    return <Observable<IDataExportAppUsers[]>>this.api.get(url, params, true);
  }

  generateReportByType(item: IDataExport): Observable<any> {
    const params = new HttpParams().set('school_id', this.session.school.id.toString());

    switch (item.type) {
      case DataExportType.appUsers:
        return this.getAppUsers(params).pipe(
          tap((data: IDataExportAppUsers[]) => {
            this.exportDataUtils.createAppUsersCSV(data);
            this.trackExportDataSuccess(dataExportAmplitudeMap[DataExportType.appUsers]);
          })
        );
      default:
        throwError(new Error('DataExportListComponent Error: Unknown Report Type'));
    }
  }

  private trackExportDataSuccess(dataType: string) {
    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.EXPORT_DATA_SUCCESS, {
      data_type: dataType
    });
  }
}
