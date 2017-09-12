import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';

import { CPSession } from './../../../session/index';
import { CPTopBarComponent } from './cp-topbar.component';
import { mockUser, mockSchool } from './../../../session/mock';
import { CP_PRIVILEGES_MAP } from './../../constants/privileges';


class MockElementRef implements ElementRef {
  nativeElement = {};
}

class RouterStub {
  url = '/manage/mock';

  events = Observable.of(false);

  navigateByUrl(url: string) {
    return url;
  }
}

describe('CPTopBarComponent', () => {
  let mockSession: CPSession;
  let component: CPTopBarComponent;
  let fixture: ComponentFixture<CPTopBarComponent>;
  let de: DebugElement;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CPTopBarComponent,
      ],
      providers: [
        CPSession,
        { provide: Router, useClass: RouterStub },
        { provide: ElementRef, useValue: new MockElementRef() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(CPTopBarComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    element = fixture.nativeElement;

    component.user = mockUser;
    component.school = mockSchool;

    mockSession = new CPSession();
    mockSession.user = mockUser;
    mockSession.school = mockSchool;

    component.session = mockSession;
  });

  it('Should return Services as the home page', () => {
    expect(component.getManageHomePage()).toEqual('services');
  });

  it('Should return Events as the home page', () => {
    component.user.school_level_privileges[component.school.id][CP_PRIVILEGES_MAP.events] = {
      r: true,
      w: true
    }
    expect(component.getManageHomePage()).toEqual('events');

    delete component.user.school_level_privileges[component.school.id][CP_PRIVILEGES_MAP.events];
  });

  it('isManage is true if manage in url ', () => {
    expect(component.isManage(component.router.url)).toBeTruthy();
  });

  it('isManage is true if manage in url ', () => {
    expect(component.isManage('/notify/announcements')).toBeFalsy();
  });

  it('Should display default avatar if none provided', () => {
    fixture.detectChanges();
    const style = de.query(By.css('.nav__school__thumb')).styles['background-image'];
    expect(style).toContain('url( /_karma_webpack_/user.png)');
  })
});
