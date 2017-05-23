import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SharedModule } from '../../../../../shared/shared.module';
import { EventsListComponent } from './events-list.component';
import { EventsService } from '../events.service';
import { StoreModule } from '@ngrx/store';
import { HttpModule } from '@angular/http';

import { EventsModule } from '../events.module';



describe('Events list Component', () => {
  let spy;
  let eventsService;
  let fixture: ComponentFixture<EventsListComponent>;
  let comp: EventsListComponent;

  const state = {
    start: null,
    end: null,
    search_str: null,
    store_id: null,
    attendance_only: 0,
    sort_field: 'start',
    exclude_current: null,
    sort_direction: 'asc',
    events: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, EventsModule, SharedModule, StoreModule.provideStore({}) ],

      declarations: [ ],

      providers: [ EventsService ],


    });

    fixture = TestBed.createComponent(EventsListComponent);
    eventsService = fixture.debugElement.injector.get(EventsService);
    comp = fixture.componentInstance;

    spy = spyOn(eventsService, 'getEvents')
          .and.returnValue(Promise.resolve([
            {
              'id': 1,
              'title': 'Mock Event'
            }
          ]));


    comp.state = state;
  });

  it('should load events', () => {
    expect(comp.events.length).toBe(1);
  });
});

