import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CPI18nService } from '@shared/services';
import { configureTestSuite } from '@shared/tests';
import { SharedModule } from '@shared/shared.module';
import { TestUsersComponent } from './test-users.component';

describe('TestUsersComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      await TestBed.configureTestingModule({
        imports: [SharedModule],
        providers: [CPI18nService],
        declarations: [TestUsersComponent]
      }).compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let component: TestUsersComponent;
  let fixture: ComponentFixture<TestUsersComponent>;

  beforeEach(
    async(() => {
      fixture = TestBed.createComponent(TestUsersComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
