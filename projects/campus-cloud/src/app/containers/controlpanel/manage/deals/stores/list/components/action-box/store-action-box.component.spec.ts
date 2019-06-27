import { SharedModule } from './../../../../../../../../shared/shared.module';
import { CPTrackingService } from './../../../../../../../../shared/services/tracking.service';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { StoreActionBoxComponent } from './store-action-box.component';
import { CPI18nService } from '../../../../../../../../shared/services/i18n.service';

describe('DealsStoreActionBoxComponent', () => {
  let spy;
  let component: StoreActionBoxComponent;
  let fixture: ComponentFixture<StoreActionBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StoreActionBoxComponent],
      imports: [RouterTestingModule, SharedModule],
      providers: [CPTrackingService, CPI18nService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(StoreActionBoxComponent);
        component = fixture.componentInstance;
        spyOn(component.cpTracking, 'getEventProperties');

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
