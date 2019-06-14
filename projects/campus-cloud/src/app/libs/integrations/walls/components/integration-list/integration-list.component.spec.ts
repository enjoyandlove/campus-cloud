import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CPSession } from '@campus-cloud/session';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { WallsSocialPostCategoryIdToNamePipe } from './../../pipes';
import { WallsIntegrationListComponent } from './integration-list.component';
import { CommonIntegrationsModule } from '@campus-cloud/libs/integrations/common/common-integrations.module';

describe('WallsIntegrationListComponent', () => {
  let component: WallsIntegrationListComponent;
  let fixture: ComponentFixture<WallsIntegrationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [CPSession],
      imports: [SharedModule, CommonIntegrationsModule],
      declarations: [WallsIntegrationListComponent, WallsSocialPostCategoryIdToNamePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallsIntegrationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
