import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { DashboardModule } from './../../dashboard.module';
import { DashboardService } from './../../dashboard.service';
import { DashboardDownloadsRegistrationComponent } from './dashboard-downloads-registration.component';
import {
  addGroup,
  aggregate,
  groupByWeek,
  groupByMonth,
  groupByQuarter,
  CPI18nService
} from '@campus-cloud/shared/services';

class MockDashboardService {
  getDownloads() {
    return observableOf([1, 2]);
  }
}

const mockSeries = [1, 2, 0, 0, 1, 2];

const mockDates = [
  '2016-12-01',
  '2016-12-17',
  '2016-12-28',
  '2017-01-12',
  '2017-01-28',
  '2017-12-11'
];

describe('DashboardDownloadsRegistrationComponent', () => {
  let fixture: ComponentFixture<DashboardDownloadsRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DashboardModule],
      declarations: [],
      providers: [
        CPSession,
        CPI18nService,
        { provide: DashboardService, useClass: MockDashboardService }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDownloadsRegistrationComponent);

    fixture.detectChanges(); // trigger initial data binding
  });

  it('addGroup', () => {
    const mockData1 = [1, 2, 3];
    const mockData2 = [4, 5, 6];
    const expected = [6, 15];

    expect(addGroup([mockData1])).toEqual([6]);
    expect(addGroup([mockData2])).toEqual([15]);
    expect(addGroup([mockData1, mockData2])).toEqual(expected);
  });

  it('groupByWeek', () => {
    const expected = [1, 2, 0, 0, 1, 2];

    groupByWeek(mockDates, mockSeries).then((res) => {
      expect(res).toEqual(expected);
    });
  });

  it('groupByMonth', () => {
    const expected = [3, 1, 2];

    groupByMonth(mockDates, mockSeries).then((res) => {
      expect(res).toEqual(expected);
    });
  });

  it('groupByQuarter', () => {
    const expected = [3, 1, 2];

    groupByQuarter(mockDates, mockSeries).then((res) => {
      expect(res).toEqual(expected);
    });
  });

  it('aggregate', () => {
    const dates = [1, 1, 2, 3, 3, 3, 4];
    const series = [0, 3, 2, 1, 3, 2, 0];
    const expected = [3, 2, 6, 0];

    aggregate(dates, series).then((res) => {
      expect(res).toEqual(expected);
    });
  });
});
