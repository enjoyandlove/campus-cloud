import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestUsersComponent } from './test-users.component';
import { configureTestSuite } from '@client/app/shared/tests';
import { SharedModule } from '@client/app/shared/shared.module';
import { CPI18nService } from '@client/app/shared/services';

fdescribe('TestUsersComponent', () => {
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
