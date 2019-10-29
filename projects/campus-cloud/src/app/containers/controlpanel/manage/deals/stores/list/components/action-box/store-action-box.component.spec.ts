import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { CPTestModule } from '@campus-cloud/shared/tests';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { StoreActionBoxComponent } from './store-action-box.component';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';

describe('DealsStoreActionBoxComponent', () => {
  let spy;
  let component: StoreActionBoxComponent;
  let fixture: ComponentFixture<StoreActionBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StoreActionBoxComponent],
      imports: [RouterTestingModule, SharedModule, CPTestModule],
      providers: [CPTrackingService, CPI18nService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(StoreActionBoxComponent);
        component = fixture.componentInstance;
        spyOn(component.cpTracking, 'getAmplitudeMenuProperties');

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
