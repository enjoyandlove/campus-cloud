import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LightboxCarouselComponent } from './lightbox-carousel.component';

describe('LightboxCarouselComponent', () => {
  let component: LightboxCarouselComponent;
  let fixture: ComponentFixture<LightboxCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightboxCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightboxCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
