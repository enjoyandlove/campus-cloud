import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { OrientationEventsComponent } from '../../../../manage/orientation/events/orientation-events.component';

import { OrientationEventsModule } from '../../../../manage/orientation/events/orientation-events.module';

import { DashboardModule } from '../../../dashboard.module';
import { AuthGuard } from '../../../../../../config/guards';
import { DashboardTopResourceTitleComponent } from './dashboard-top-resource-title.component';

class MockAuthGuard {
  canActivate() {}
}

describe('DashboardTopResourceTitleComponent', () => {
  let router: Router;
  let location: Location;
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DashboardModule,
        OrientationEventsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'manage/orientation/:orientationId/events',
            component: OrientationEventsComponent
          }
        ])
      ],
      providers: [{ provide: AuthGuard, useClass: MockAuthGuard }]
    })
      .compileComponents()
      .then(() => {
        router = TestBed.get(Router);
        location = TestBed.get(Location);
        fixture = TestBed.createComponent(DashboardTopResourceTitleComponent);
        comp = fixture.componentInstance;
        comp.canNavigate = true;
        comp.item = mockItem;
        router.initialNavigation();
      });
  }));

  it('should not navigate', () => {
    comp.canNavigate = false;
    fixture.detectChanges();

    const link = fixture.debugElement.query(By.css('p.title')).nativeElement;
    link.click();

    expect(location.path()).toEqual('/');
    expect(link.textContent.trim()).toBe(mockItem.name);
  });

  it('should navigate to expected URL', fakeAsync(() => {
    fixture.detectChanges();

    const link = fixture.debugElement.query(By.css('p.title')).nativeElement;
    link.click();

    tick();
    expect(link.textContent.trim()).toBe(mockItem.name);
    expect(location.path()).toEqual(mockItem.resourceUrl);
  }));
});
