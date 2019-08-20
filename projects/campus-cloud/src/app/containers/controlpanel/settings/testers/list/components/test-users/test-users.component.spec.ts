import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { mockTesters } from '../../../tests';
import { CPI18nService } from '@campus-cloud/shared/services';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { TestUsersComponent } from './test-users.component';
import { NoTestersComponent } from '../no-testers/no-testers.component';

describe('TestUsersComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      await TestBed.configureTestingModule({
        imports: [SharedModule],
        providers: [CPI18nService],
        declarations: [TestUsersComponent, NoTestersComponent]
      }).compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let component: TestUsersComponent;
  let fixture: ComponentFixture<TestUsersComponent>;
  let debugEl: DebugElement;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TestUsersComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;

    component.users = mockTesters;

    fixture.detectChanges();
  }));

  it('should be empty', () => {
    component.users = [];
    fixture.detectChanges();
    const testUsers = debugEl.queryAll(By.css('.cp-form__item'));
    const noContent = debugEl.query(By.css('cp-no-content'));
    expect(testUsers.length).toBe(0);
    expect(noContent).toBeTruthy();
  });

  it('should have testers', () => {
    const testUsers = debugEl.queryAll(By.css('.cp-form__item'));
    const noContent = debugEl.query(By.css('cp-no-content'));
    expect(testUsers.length).toBe(1);
    expect(noContent).toBeNull();
  });

  it('should emit resend', () => {
    const spy = spyOn(component.resend, 'emit');
    const resendBtn = debugEl.query(By.css('.cpbtn--secondary'));
    resendBtn.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(mockTesters[0].id);
  });

  it('should emit delete', () => {
    const spy = spyOn(component.delete, 'emit');
    const deleteBtn = debugEl.query(By.css('.delete'));
    deleteBtn.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(mockTesters[0].id);
  });
});
