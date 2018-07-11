import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { CPSession } from '../../../session';
import { CPLineChartComponent } from './cp-line-chart.component';
import { CPLineChartUtilsService } from './cp-line-chart.utils.service';

describe('CPLineChartComponent', () => {
  let divider;
  let comp: CPLineChartComponent;
  let utils: CPLineChartUtilsService;
  let fixture: ComponentFixture<CPLineChartComponent>;

  const range = {
    start: '2017-12-16',
    end: '2017-12-18'
  };

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CPLineChartComponent],
        providers: [
          CPSession,
          CPLineChartUtilsService
        ]
      }).overrideComponent(CPLineChartComponent, {
          set: {
            template: '<div>No Template</div>'
          }
        }).compileComponents();
    })
  );

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(CPLineChartComponent);
    comp = fixture.componentInstance;
    utils = TestBed.get(CPLineChartUtilsService);

    comp.series = [[1, 2, 3], [3, 2, 1]];
    spyOn(comp, 'drawChart');
    fixture.detectChanges(); // trigger initial data binding
  });

  it('dailyLabel', () => {
    const expected = 'Dec 17';

    expect(utils.dailyLabel(range.start, 1)).toEqual(expected);
  });

  it('weeklyLabel', () => {
    const expected = 'Dec 23 - Dec 30';

    expect(utils.weeklyLabel(range.start, 1)).toEqual(expected);
  });

  it('monthlyLabel', () => {
    const expected = 'Jan 18';

    expect(utils.monthlyLabel(range.start, 1)).toEqual(expected);
  });

  it('quarterLabel', () => {
    const expected = 'Mar 18';

    expect(utils.quarterLabel(range.start, 1)).toEqual(expected);
  });

  it('labelByDivider', () => {
    const dailyExpected = 'Dec 17';
    const weeklyExpected = 'Dec 23 - Dec 30';
    const monthlyExpected = 'Jan 18';
    const quarterlyExpected = 'Mar 18';

    divider = 0;
    expect(utils.labelByDivider(divider, range, 1)).toEqual(dailyExpected);

    divider = 1;
    fixture.detectChanges();
    expect(utils.labelByDivider(divider, range, 1)).toEqual(weeklyExpected);

    divider = 2;
    fixture.detectChanges();
    expect(utils.labelByDivider(divider, range, 1)).toEqual(monthlyExpected);

    divider = 3;
    fixture.detectChanges();
    expect(utils.labelByDivider(divider, range, 1)).toEqual(quarterlyExpected);
  });

  it('buildLabels', () => {
    divider = 0;
    const expected = ['Dec 16', 'Dec 17', 'Dec 18'];
    const result = utils.buildLabels(divider, range, comp.series);

    expect(result).toEqual(expected);
    expect(result.length).toEqual(3);
    expect(result).toContain(expected[0]);
    expect(result[0]).toEqual(expected[0]);
  });
});
