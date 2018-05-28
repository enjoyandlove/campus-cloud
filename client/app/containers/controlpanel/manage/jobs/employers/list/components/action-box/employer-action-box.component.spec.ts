import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { EmployerModule } from '../../../employer.module';
import { EmployerActionBoxComponent } from './employer-action-box.component';
import { CPI18nService } from '../../../../../../../../shared/services/i18n.service';

describe('EmployerActionBoxComponent', () => {
  let spy;
  let component: EmployerActionBoxComponent;
  let fixture: ComponentFixture<EmployerActionBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EmployerModule],
      providers: [CPI18nService]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(EmployerActionBoxComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('onSearch', () => {
    spyOn(component.search, 'emit');

    component.onSearch('nothing');

    expect(component.search.emit).toHaveBeenCalledTimes(1);
    expect(component.search.emit).toHaveBeenCalledWith('nothing');
  });

  it('onLaunchCreateModal', () => {
    spy = spyOn(component.launchCreateModal, 'emit');

    const createButton = fixture.debugElement.query(By.css('.cp-card .cpbtn')).nativeElement;

    createButton.click();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });

});
