import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CPSession } from '@app/session';
import { configureTestSuite } from '@shared/tests';
import { mockSchool, mockUser } from '@app/session/mock';
import { SharedModule } from '@app/shared/shared.module';
import { EventSourceToIconPipe } from './../../../pipes';
import { CPI18nService } from '@shared/services/i18n.service';
import { ListUpcomingComponent } from './list-upcoming.component';
import { EventUtilService } from './../../../events.utils.service';
import { CPTrackingService } from '@shared/services/tracking.service';

const initialState = {
  start: null,
  end: null,
  store_id: null,
  search_str: null,
  attendance_only: 0,
  sort_field: 'start',
  sort_direction: 'asc',
  exclude_current: null,
  events: []
};

describe('ListUpcomingComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, RouterTestingModule],
        declarations: [ListUpcomingComponent, EventSourceToIconPipe],
        providers: [CPI18nService, CPTrackingService, CPSession, EventUtilService]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let de: DebugElement;
  let session: CPSession;
  let component: ListUpcomingComponent;
  let fixture: ComponentFixture<ListUpcomingComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUpcomingComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    session = TestBed.get(CPSession);
    session.g.set('user', mockUser);
    session.g.set('school', mockSchool);

    component.events = [];
    component.state = initialState;

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should render events in the page', () => {
    component.events = [{}, {}];
    fixture.detectChanges();

    const listElements = de.queryAll(By.css('.cp-form__item'));
    expect(listElements.length).toBe(2);
  });

  it('should display icon if event is integrated', () => {
    component.events = [{ id: 1, is_external: true }, { id: 2, is_external: false }];
    fixture.detectChanges();

    const listElements = de.queryAll(By.css('.cp-form__item'));
    const [integratedEventEl, notIntegratedEventEl] = listElements;

    const integratedEventIcon = integratedEventEl.query(By.css('.js_event_external'));
    const notIntegratedEventIcon = notIntegratedEventEl.query(By.css('.js_event_external'));

    expect(integratedEventIcon).toBeDefined();
    expect(notIntegratedEventIcon).toBeNull();
  });
});
