import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CPI18nService } from '@shared/services';
import { configureTestSuite } from '@shared/tests';
import { SharedModule } from '@shared/shared.module';
import { TestersActionBoxComponent } from './testers-action-box.component';

describe('TestersActionBoxComponent', () => {
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

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TestersActionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
