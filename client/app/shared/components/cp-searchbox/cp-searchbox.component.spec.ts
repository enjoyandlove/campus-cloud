import { Observable } from 'rxjs/Observable';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CPSearchBoxComponent } from './cp-searchbox.component';

describe('CPSearchBoxComponent', () => {
  let component: CPSearchBoxComponent;
  let fixture: ComponentFixture<CPSearchBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CPSearchBoxComponent],
    });

    fixture = TestBed.createComponent(CPSearchBoxComponent);

    // get test component from the fixture
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('Should emit the query value if any', () => {
    component.ngAfterViewInit();

    component.stream$ = Observable.of('hello world');

    component
      .stream$
      .switchMap(query => {
        const queryEmit$ = component.query;
        const isSearch$ = component.isSearch$;
        const searchingEmit$ = component.searching;

        component.query.emit(query);
        component.isSearch$.next(true);
        component.searching.emit(false);

        return Observable.combineLatest(queryEmit$, isSearch$, searchingEmit$);
      })
      .subscribe(res => {
        fixture.detectChanges();

        expect(res[0]).toBe('hello world');
        expect(res[1]).toBeTruthy();
        expect(res[2]).toBeFalsy();
      }
      );
  })

  it('Should clear input', () => {
    const query$ = component.query;
    const isSearch$ = component.isSearch$;

    const stream$ = Observable.combineLatest(query$, isSearch$);

    stream$.subscribe(res => {
      fixture.detectChanges();
      expect(component.q.nativeElement.value).toEqual('');
      expect(res[0]).toBeNull();
      expect(res[1]).toBeFalsy();
    });

    component.onClear();
  })

  it('Should emit an empty value', () => {
    component.ngAfterViewInit();

    component.stream$ = Observable.of('');

    component
      .stream$
      .switchMap(_ => {
        const queryEmit$ = component.query;
        const isSearch$ = component.isSearch$;
        const searchingEmit$ = component.searching;

        component.query.emit(null);
        component.isSearch$.next(false);
        component.searching.emit(false);

        return Observable.combineLatest(queryEmit$, isSearch$, searchingEmit$);
      })
      .subscribe(res => {
        fixture.detectChanges();

        expect(res[0]).toBeNull();
        expect(res[1]).toBeFalsy();
        expect(res[2]).toBeFalsy();
      }
      );
  })
})
