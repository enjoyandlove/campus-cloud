import { TestBed } from '@angular/core/testing';
import { provideRoutes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { CPAvatarComponent } from './cp-avatar.component';

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CPAvatarComponent],
      providers: [provideRoutes([])]
    });
  });

  it('it should add 2', () => {
    let fixture = TestBed.createComponent(CPAvatarComponent);

    expect(fixture.componentInstance.dumm2(2)).toBe(8);
  });

  it('dummy method should have been called', () => {
    let fixture = TestBed.createComponent(CPAvatarComponent);
    let dummySpy = spyOn(fixture.componentInstance, 'dummy');
    fixture.componentInstance.dummy();
    fixture.detectChanges();
    expect(dummySpy).toHaveBeenCalledTimes(1);
  });
  // it('isLoading should be true', () => {
  //   let fixture = TestBed.createComponent(CPAvatarComponent);
  //   fixture.detectChanges();
  //   expect(fixture.componentInstance.isLoading).toBeTruthy();
  // });

  // it('isLoading should be false after calling method', () => {
  //   let fixture = TestBed.createComponent(CPAvatarComponent);
  //   fixture.debugElement.componentInstance.dummy();
  //   fixture.detectChanges();
  //   console.log(fixture.debugElement.componentInstance.dummy());
  //   expect(fixture.componentInstance.isLoading).toBeFalsy();
  // });
});



