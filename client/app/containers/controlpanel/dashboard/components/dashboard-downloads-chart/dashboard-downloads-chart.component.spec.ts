import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { DashboardDownloadsChartComponent } from './dashboard-downloads-chart.component';


describe('DashboardDownloadsChartComponent', () => {
  let comp: DashboardDownloadsChartComponent;
  let fixture: ComponentFixture<DashboardDownloadsChartComponent>;
  // async beforeEach
  beforeEach( async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDownloadsChartComponent ],
    })
    .compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDownloadsChartComponent);
    comp    = fixture.componentInstance;

    comp.range = {
      start: '2017-12-16',
      end: '2017-12-18'
    };

    comp.series = [
      [1, 2, 3],
      [3, 2, 1]
    ]

    comp.divider = 0;

    fixture.detectChanges(); // trigger initial data binding
  });

  it('dailyLabel', () => {
    const expected = 'Dec 17th';

    expect(comp.dailyLabel(1)).toEqual(expected);
  })

  it('weeklyLabel', () => {
    const expected = 'Dec 23 - Dec 30';

    expect(comp.weeklyLabel(1)).toEqual(expected);
  })

  it('monthlyLabel', () => {
    const expected = 'Jan 18';

    expect(comp.monthlyLabel(1)).toEqual(expected);
  })

  it('quarterLabel', () => {
    const expected = 'Mar 18';

    expect(comp.quarterLabel(1)).toEqual(expected);
  })

  it('labelByDivider', () => {
    const dailyExpected = 'Dec 17th';
    const weeklyExpected = 'Dec 23 - Dec 30';
    const monthlyExpected = 'Jan 18';
    const quarterlyExpected = 'Mar 18';

    expect(comp.labelByDivider(1)).toEqual(dailyExpected);

    comp.divider = 1;
    fixture.detectChanges();
    expect(comp.labelByDivider(1)).toEqual(weeklyExpected);

    comp.divider = 2;
    fixture.detectChanges();
    expect(comp.labelByDivider(1)).toEqual(monthlyExpected);

    comp.divider = 3;
    fixture.detectChanges();
    expect(comp.labelByDivider(1)).toEqual(quarterlyExpected);
  })

  it('buildLabels', () => {
    const expected = ['Dec 16th', 'Dec 17th', 'Dec 18th'];
    const result = comp.buildLabels();

    expect(result).toEqual(expected);
    expect(result.length).toEqual(3);
    expect(result).toContain(expected[0]);
    expect(result[0]).toEqual(expected[0]);
  })
});
