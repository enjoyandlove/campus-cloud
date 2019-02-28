import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestersActionBoxComponent } from './testers-action-box.component';
import { configureTestSuite } from '@client/app/shared/tests';
import { SharedModule } from '@client/app/shared/shared.module';
import { CPI18nService } from '@client/app/shared/services';

fdescribe('TestersActionBoxComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      await TestBed.configureTestingModule({
        imports: [SharedModule],
        providers: [CPI18nService],
        declarations: [TestersActionBoxComponent]
      }).compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let component: TestersActionBoxComponent;
  let fixture: ComponentFixture<TestersActionBoxComponent>;

  beforeEach(
    async(() => {
      fixture = TestBed.createComponent(TestersActionBoxComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
