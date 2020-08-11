import { Store } from '@ngrx/store';
import { get as _get } from 'lodash';
import { from, fromEvent } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { concatMap, map, mergeMap, switchMap, first } from 'rxjs/operators';

import { CPSession } from '@campus-cloud/session';
import { CPI18nPipe } from '@campus-cloud/shared/pipes/i18n/i18n.pipe';
import { IDateRange } from '@campus-cloud/shared/components';
import { baseActionClass, ISnackbar } from '@campus-cloud/store';
import IServiceProvider from '@controlpanel/manage/services/providers.interface';
import { IStudentFilter } from '../../assess/engagement/engagement.utils.service';

const jsPDF = require('jspdf');
const LEFT_MARGIN = 30;
const PAGE_WIDTH = 210;
const THUMB_WIDTH = 30;
const THUMB_HEIGHT = 30;
const PAGE_HEIGHT = 296;
const CENTIMETER = 0.352778;
const fullWidth = PAGE_WIDTH - LEFT_MARGIN * 2;
const corsParam = new HttpParams().append('x-cors', '1');

export interface IFilterState {
  searchText: string;
  dateRange: IDateRange;
  studentFilter: IStudentFilter;
}

@Injectable()
export class ProvidersUtilsService {
  constructor(
    private session: CPSession,
    public cpI18Pipe: CPI18nPipe,
    public http: HttpClient,
    private store: Store<ISnackbar>
  ) {}

  addSearchParams(search: HttpParams, state: IFilterState): HttpParams {
    if (!state) {
      return search;
    }
    search = this.session.addSchoolId(search);
    if (state.searchText) {
      search = search.append('search_text', state.searchText);
    }
    if (state.studentFilter) {
      const listId = _get(state, ['studentFilter', 'listId']);
      const personaId = _get(state, ['studentFilter', 'personaId']);
      if (listId) {
        search = search.append('user_list_id', listId.toString());
      } else if (personaId) {
        search = search.append('persona_id', personaId.toString());
      }
    }
    if (state.dateRange && state.dateRange.start && state.dateRange.end) {
      search = search
        .append('start', state.dateRange.start.toString())
        .append('end', state.dateRange.end.toString());
    }
    return search;
  }

  exportQRsPdf(serviceName: string, allProviders: Array<IServiceProvider>) {
    let fetchQRs$ = from(allProviders).pipe(
      mergeMap((provider) => this.fetchQRCode(provider), 10),
      concatMap(({ providerId, blob }) => this.loadImage(providerId, blob))
    );

    this.http
      .get(this.session.g.get('school').app_logo_url, {
        responseType: 'blob',
        headers: { 'Access-Control-Allow-Origin': '*' },
        params: corsParam
      })
      .pipe(
        switchMap((blob) => this.loadImage(0, blob)),
        map(({ imgData }) => imgData)
      )
      .subscribe((logoImgData) => {
        let providerQRCode = {};

        fetchQRs$.subscribe(
          ({ providerId, imgData }) => {
            providerQRCode[providerId] = imgData;
          },
          () => {
            this.store.dispatch(
              new baseActionClass.SnackbarError({
                body: this.cpI18Pipe.transform('something_went_wrong')
              })
            );
          },
          () => {
            const doc = new jsPDF();
            allProviders.forEach((provider) => {
              let imgData = providerQRCode[provider.id];
              this.addQRToPDF(doc, serviceName, logoImgData, provider, imgData);
            });
            // delete blank page at the end of pdf
            doc.deletePage(doc.internal.getNumberOfPages());
            doc.save(`${this.getFileName(serviceName)}_kit.pdf`);
          }
        );
      });
  }

  loadImage(providerId, imgBlob) {
    let reader = new FileReader();
    let reader$ = fromEvent(reader, 'load').pipe(
      first(),
      map(() => ({ providerId: providerId, imgData: reader.result }))
    );
    reader.readAsDataURL(imgBlob);
    return reader$;
  }

  fetchQRCode(provider) {
    return this.http
      .get(provider.qr_img_url, {
        responseType: 'blob',
        headers: { 'Access-Control-Allow-Origin': '*' },
        params: corsParam
      })
      .pipe(map((blob) => ({ providerId: provider.id, blob: blob })));
  }

  addQRToPDF(doc, serviceName, appLogoImgData, provider, qrImgData) {
    // region QR image
    const imageFormat = decodeURIComponent(qrImgData)
      .split(',')[0]
      .split('/')[1]
      .split(';')[0]
      .toUpperCase();
    try {
      doc.addImage(qrImgData, imageFormat, 60, 60, 90, 90);
    } catch (error) {
      throw new Error(error);
    }
    // endregion

    // region service name
    const fontSize = this.getPDFTitleFontSize(serviceName);
    doc.setFontSize(fontSize);
    doc.setFontType('bold');
    doc.setFont('helvetica');
    let textHeight = PAGE_HEIGHT - 130;
    const text = <Array<string>>doc.splitTextToSize(serviceName, fullWidth);
    text.forEach((line, index) => {
      doc.text(line, 105, textHeight + index * (fontSize * CENTIMETER), 'center');
    });
    // endregion

    // region provider name
    doc.setFontSize(34);
    doc.setFontType('normal');
    textHeight = PAGE_HEIGHT - 80;
    const providerNameText = doc.splitTextToSize(provider.provider_name, fullWidth);
    providerNameText.forEach((line, index) => {
      doc.text(line, 105, textHeight + index * (CENTIMETER * 34), 'center');
    });
    // endregion

    // region bottom separator
    doc.rect(LEFT_MARGIN, PAGE_HEIGHT - 50, fullWidth, 0.1);
    doc.setDrawColor(255, 0, 0);
    doc.setFillColor(255, 0, 0);
    // endregion

    // region app logo
    const appLogoFormat = decodeURIComponent(appLogoImgData)
      .split(',')[0]
      .split('/')[1]
      .split(';')[0]
      .toUpperCase();
    doc.addImage(
      decodeURIComponent(appLogoImgData),
      appLogoFormat,
      LEFT_MARGIN,
      PAGE_HEIGHT - 43,
      THUMB_HEIGHT,
      THUMB_WIDTH
    );
    // endregion

    // region footer note
    doc.setFontSize(20);
    let titleTextKey = 't_checkin_no_feedback_pdf_title';
    const pageOneFooter = doc.splitTextToSize(
      this.cpI18Pipe.transform(titleTextKey, this.session.g.get('school').name),
      115
    );
    doc.text(65, PAGE_HEIGHT - 30, pageOneFooter);
    // endregion

    doc.addPage();
  }

  getPDFTitleFontSize(serviceName) {
    if (serviceName.length < 15) {
      return 50;
    } else if (serviceName.length < 30) {
      return 40;
    } else if (serviceName.length < 50) {
      return 30;
    }

    return 22;
  }

  getFileName(serviceName) {
    return serviceName
      .toLowerCase()
      .split(' ')
      .join('_');
  }
}
