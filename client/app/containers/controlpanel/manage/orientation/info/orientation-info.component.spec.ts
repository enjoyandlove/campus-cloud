import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CPSession } from './../../../../../session';
import { Observable } from 'rxjs/Observable';

import { OrientationInfoComponent } from './orientation-info.component';
import { OrientationService } from '../orientation.services';
import { OrientationDetailsModule } from '../details/orientation-details.module';

class MockOrientationService {
  dummy;
  mockPrograms = require('../mock.json');

  getProgramById(programId: number, search: any) {
    this.dummy = [search];
    const program = this.mockPrograms.filter((item) => item.id === programId);

    return Observable.of(program);
  }
}

describe('OrientationInfoComponent', () => {
  let spy;
  let title: HTMLElement;
  let component: OrientationInfoComponent;
  let service: OrientationService;
  let fixture: ComponentFixture<OrientationInfoComponent>;

  const mockProgram = Observable.of([{
    'id': 84,
    'name': 'Hello World!',
    'description': 'This is description',
    'events': 12,
    'members': 10,
    'start': '1557637200',
    'end': '1557637200',
    'has_membership': 0
  }]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [OrientationDetailsModule],
      providers: [
        CPSession,
        { provide: OrientationService, useClass: MockOrientationService },
        { provide: ActivatedRoute,
          useValue: {
            parent: {
              snapshot: {
                params: Observable.of({orientationId: 1}),
              },
            },
          }
        }
      ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(OrientationInfoComponent);
      component = fixture.componentInstance;
      service = TestBed.get(OrientationService);
      spy = spyOn(component, 'fetch');
      component.loading = false;
    });
  }));

  it('should display orientation program Title', () => {
    service.getProgramById(84, null).subscribe((res) => component.selectedProgram = res[0]);

    fixture.detectChanges();
    title = fixture.nativeElement.querySelector('.orientation__title');
    expect(title.textContent).toEqual('Hello World!');
  });

  it('should fetch orientation program by Id', () => {
    expect(spy).not.toHaveBeenCalled();
    component.fetch();
    expect(spy).toHaveBeenCalled();
    expect(service.getProgramById(84, null)).toEqual(mockProgram);
  });

});
