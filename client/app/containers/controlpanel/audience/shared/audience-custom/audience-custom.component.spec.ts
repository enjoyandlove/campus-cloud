import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SharedModule } from './../../../../../shared/shared.module';
import { AudienceCustomComponent } from './audience-custom.component';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

describe('AudienceCustomComponent', () => {
  let comp: AudienceCustomComponent;
  let fixture: ComponentFixture<AudienceCustomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [CPI18nService],
      declarations: [AudienceCustomComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(AudienceCustomComponent);
    comp = fixture.componentInstance;
  });

  it('import button should not be hidden', () => {
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button.cpbtn--link'));

    expect(button).not.toBe(null);
  });

  it('import button should be hidden', () => {
    comp.importButton = false;

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button.cpbtn--link'));

    expect(button).toBe(null);
  });

  it('should emit importClick on button click', () => {
    fixture.detectChanges();

    spyOn(comp.importClick, 'emit');

    const button = fixture.debugElement.query(By.css('button.cpbtn--link')).nativeElement;

    button.click();

    expect(comp.importClick.emit).toHaveBeenCalledTimes(1);
  });
});
