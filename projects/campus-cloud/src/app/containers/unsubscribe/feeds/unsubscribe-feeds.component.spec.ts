import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { UnsubscribeFeedsComponent } from './unsubscribe-feeds.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { MockUnsubscribe, UnsubscribeFeedsService } from '@campus-cloud/services/social';
import { UnsubscribeModule } from '@campus-cloud/containers/unsubscribe/unsubscribe.module';

describe('UnsubscribeFeedsComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, UnsubscribeModule],
        providers: [{ provide: UnsubscribeFeedsService, useClass: MockUnsubscribe }]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let fixture: ComponentFixture<UnsubscribeFeedsComponent>;
  let comp: UnsubscribeFeedsComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubscribeFeedsComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should unsubscribe - success', () => {
    spyOn(comp.service, 'unsubscribe').and.returnValue(of({}));

    comp.ngOnInit();

    comp.view$.subscribe(({ loading, error }) => {
      expect(error).toBe(false);
      expect(loading).toBe(false);
    });
  });

  it('should unsubscribe - error', () => {
    spyOn(comp.service, 'unsubscribe').and.returnValue(throwError({}));

    comp.ngOnInit();

    comp.view$.subscribe(({ loading, error }) => {
      expect(error).toBe(true);
      expect(loading).toBe(false);
    });
  });
});
