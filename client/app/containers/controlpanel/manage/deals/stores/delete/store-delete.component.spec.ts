import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { StoreModule } from '../store.module';
import { StoreService } from '../store.service';
import { CPSession } from '../../../../../../session';
import { StoreDeleteComponent } from './store-delete.component';
import { mockSchool } from '../../../../../../session/mock/school';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';

class MockService {
  dummy;
  deleteStore(id: number, search: any) {
    this.dummy = [id, search];

    return Observable.of({});
  }
}

describe('DealsStoreDeleteComponent', () => {
  let spy;
  let search;
  let component: StoreDeleteComponent;
  let fixture: ComponentFixture<StoreDeleteComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [StoreModule, RouterTestingModule],
        providers: [CPSession, CPI18nService, { provide: StoreService, useClass: MockService }]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(StoreDeleteComponent);
          component = fixture.componentInstance;

          component.store = {
            id: 1,
            name: 'Hello World',
            logo_url: 'image.jpeg',
            description: 'This is description'
          };
          component.session.g.set('school', mockSchool);
          search = new HttpParams().append(
            'school_id',
            component.session.g.get('school').id.toString()
          );
        });
    })
  );

  it('buttonData should have "Delete" label & "Danger class"', () => {
    component.ngOnInit();
    expect(component.buttonData.text).toEqual('Delete');
    expect(component.buttonData.class).toEqual('danger');
  });

  it('should delete store', () => {
    spyOn(component.deleted, 'emit');
    spyOn(component.resetDeleteModal, 'emit');
    spy = spyOn(component.service, 'deleteStore').and.returnValue(Observable.of({}));

    component.onDelete();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(component.store.id, search);

    expect(component.deleted.emit).toHaveBeenCalledTimes(1);
    expect(component.deleted.emit).toHaveBeenCalledWith(component.store.id);

    expect(component.resetDeleteModal.emit).toHaveBeenCalled();
    expect(component.resetDeleteModal.emit).toHaveBeenCalledTimes(1);
  });
});
