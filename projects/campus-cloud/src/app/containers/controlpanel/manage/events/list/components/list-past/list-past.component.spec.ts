import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { ListPastComponent } from './list-past.component';
import { mockSchool, mockUser } from '@campus-cloud/session/mock';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { IntegrationSourceToIconPipe } from '@campus-cloud/libs/integrations/common/pipes/source-to-icon';

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

describe('ListPastComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, RouterTestingModule],
        declarations: [ListPastComponent, IntegrationSourceToIconPipe]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let de: DebugElement;
  let session: CPSession;
  let component: ListPastComponent;
  let fixture: ComponentFixture<ListPastComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPastComponent);
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
