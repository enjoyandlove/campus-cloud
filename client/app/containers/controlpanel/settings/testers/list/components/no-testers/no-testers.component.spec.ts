import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CPI18nService } from '@shared/services';
import { configureTestSuite } from '@shared/tests';
import { SharedModule } from '@shared/shared.module';
import { NoTestersComponent } from './no-testers.component';

describe('NoTestersComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      await TestBed.configureTestingModule({
        imports: [SharedModule],
        providers: [CPI18nService],
        declarations: [NoTestersComponent]
      }).compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let component: NoTestersComponent;
  let fixture: ComponentFixture<NoTestersComponent>;
  let debugEl: DebugElement;

  beforeEach(
    async(() => {
      fixture = TestBed.createComponent(NoTestersComponent);
      component = fixture.componentInstance;
      debugEl = fixture.debugElement;

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit create', () => {
    const spy = spyOn(component.onCreate, 'emit');
    const inviteBtn = debugEl.query(By.css('.cpbtn--primary'));
    inviteBtn.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
