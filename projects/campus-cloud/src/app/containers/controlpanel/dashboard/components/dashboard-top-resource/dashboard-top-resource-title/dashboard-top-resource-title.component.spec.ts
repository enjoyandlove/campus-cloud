import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { DashboardModule } from '../../../dashboard.module';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { DashboardTopResourceTitleComponent } from './dashboard-top-resource-title.component';

describe('DashboardTopResourceTitleComponent', () => {
  configureTestSuite();

  let spy;
  let comp: DashboardTopResourceTitleComponent;
  let fixture: ComponentFixture<DashboardTopResourceTitleComponent>;

  const mockItem = {
    id: 125,
    image: '',
    rating: 30,
    feedback: 10,
    attendees: 20,
    name: 'Hello World',
    resourceUrl: `/manage/orientation/52/events`
  };

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [DashboardModule, RouterTestingModule],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DashboardTopResourceTitleComponent);
    comp = fixture.componentInstance;

    comp.canNavigate = true;
    comp.item = mockItem;

    spy = spyOn(comp.router, 'navigate');
  }));

  it('should not navigate', () => {
    comp.canNavigate = false;
    fixture.detectChanges();

    const link = fixture.debugElement.query(By.css('p.title')).nativeElement;
    link.click();

    expect(spy).not.toHaveBeenCalled();
    expect(link.textContent.trim()).toBe(mockItem.name);
  });

  it('should navigate to expected URL', fakeAsync(() => {
    fixture.detectChanges();

    const link = fixture.debugElement.query(By.css('p.title')).nativeElement;
    link.click();

    tick();
    expect(spy).toHaveBeenCalled();
    expect(link.textContent.trim()).toBe(mockItem.name);
    expect(spy).toHaveBeenCalledWith([mockItem.resourceUrl]);
  }));
});
