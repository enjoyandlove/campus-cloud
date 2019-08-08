import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { CPSession } from '@campus-cloud/session';
import { BannerModule } from './../banner.module';
import { BannerService } from './../banner.service';
import { BannerListComponent } from './banner-list.component';
import { mockSchool } from '@projects/campus-cloud/src/app/session/mock';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { SchoolService, FileUploadService } from '@campus-cloud/shared/services';
import { MockBannerService, MockSchoolService, MockFileUploadService } from '../tests';

describe('BannerListComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, BannerModule, RouterTestingModule],
        providers: [
          provideMockStore(),
          { provide: BannerService, useClass: MockBannerService },
          { provide: SchoolService, useClass: MockSchoolService },
          { provide: FileUploadService, useClass: MockFileUploadService }
        ]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let fixture: ComponentFixture<BannerListComponent>;
  let component: BannerListComponent;
  let session: CPSession;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BannerListComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);
    fixture.detectChanges();
  }));

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct aspect ratio', () => {
    expect(component.imageRatio).toBe(1.8);
  });
});
