import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DashboardService {
  getDownloads(startRange: number, endRange: number) {
    console.log(startRange, endRange);
    return Observable.of([]);
  }
}
