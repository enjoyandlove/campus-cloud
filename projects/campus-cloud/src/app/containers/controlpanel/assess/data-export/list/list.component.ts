import { mergeMap, startWith, catchError } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { mapTo } from 'rxjs/internal/operators';
import { Subject, merge, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { IHeader } from '@campus-cloud/store';
import { IDataExport } from './../data-export.interface';
import { baseActionClass } from '@campus-cloud/store/base';
import { DataExportService } from './../data-export.service';
import { CPI18nService } from '@campus-cloud/shared/services';
import { DataExportUtilsService } from '../data-export.utils.service';

@Component({
  selector: 'cp-data-export-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class DataExportListComponent implements OnInit {
  reports: IDataExport[] = DataExportUtilsService.reports;
  downloadReportByType: Subject<IDataExport> = new Subject();
  downloadReportByType$ = this.downloadReportByType.asObservable();
  generateReport$ = this.downloadReportByType.pipe(
    mergeMap((dataSource: any) => this.service.generateReportByType(dataSource)),
    catchError(() => {
      this.errorHandler();
      return of(false);
    })
  );

  busy$ = merge(
    this.downloadReportByType$.pipe(mapTo(true)),
    this.generateReport$.pipe(mapTo(false))
  ).pipe(startWith(false));

  constructor(
    private store: Store<IHeader>,
    private cpI18n: CPI18nService,
    private service: DataExportService
  ) {}

  ngOnInit() {}

  trackByFn(_: number, item: IDataExport) {
    return item.type;
  }

  onSearch(query: string | null) {
    if (!query || query === '') {
      this.reports = DataExportUtilsService.reports;
      return;
    }

    this.reports = this.reports.filter((r: IDataExport) =>
      r.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    );
  }

  errorHandler() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }
}
