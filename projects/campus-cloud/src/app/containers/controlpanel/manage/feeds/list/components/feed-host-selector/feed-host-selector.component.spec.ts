import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { FeedHostSelectorComponent } from './feed-host-selector.component';
import { StoreCategory, ReadyStore, StoreService } from '@campus-cloud/shared/services';

const mockStores = [
  { id: 1, name: 'Mock Service', logo_url: 'mock_logo', category_id: StoreCategory.services },
  {
    id: 2,
    name: 'Mock Athletic',
    logo_url: 'mock_logo',
    category_id: StoreCategory.athletics
  },
  { id: 3, name: 'Mock Club', logo_url: 'mock_logo', category_id: StoreCategory.clubs }
] as ReadyStore[];

const storeService = jasmine.createSpyObj('StoreService', ['getRanged']);
const getRangedSpy: jasmine.Spy = storeService.getRanged.and.returnValue(of(mockStores));

describe('FeedHostSelectorComponent', () => {
  let session: CPSession;
  let component: FeedHostSelectorComponent;
  let fixture: ComponentFixture<FeedHostSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule],
      providers: [
        {
          provide: StoreService,
          useValue: storeService
        }
      ],
      declarations: [FeedHostSelectorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedHostSelectorComponent);
    component = fixture.componentInstance;

    session = TestBed.inject(CPSession);
    session.g.set('school', mockSchool);

    fixture.detectChanges();
  });

  describe('fetch', () => {
    beforeEach(() => {
      getRangedSpy.and.returnValue(of(mockStores));
    });

    it('should have right params', (done) => {
      component.fetch().subscribe(() => {
        const [, , params] = getRangedSpy.calls.mostRecent().args as [number, number, HttpParams];

        expect(params.keys().length).toBe(3);
        expect(params.get('search_str')).toBeNull();
        expect(params.get('school_id')).toBe(mockSchool.id.toString());

        expect(params.get('category_ids')).toBe(
          [StoreCategory.clubs, StoreCategory.services, StoreCategory.athletics].join(',')
        );
        done();
      });
    });

    it('should catch error and return empty object', (done) => {
      getRangedSpy.and.returnValue(throwError('Error'));
      fixture.detectChanges();

      component.fetch().subscribe((response) => {
        expect(JSON.stringify(response)).toBe('{}');
        done();
      });
    });

    it('should parse valid response into a sections object', (done) => {
      component.fetch().subscribe((response) => {
        expect(Object.keys(response).length).toBe(3);
        Object.keys(response).forEach((section) => {
          expect(response[section].length).toBe(1);
        });
        done();
      });
    });
  });

  describe('view', () => {
    it('default value', (done) => {
      component.view$.pipe(take(1)).subscribe(({ sections, search, host }) => {
        expect(JSON.stringify(sections)).toBe('{}');
        expect(search).toBe('');
        expect(host).toBe(undefined);
        done();
      });
    });
  });
});
