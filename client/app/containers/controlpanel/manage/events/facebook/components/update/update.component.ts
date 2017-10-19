import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { EventsService } from '../../../events.service';
import { CPSession } from '../../../../../../../session';
import { BaseComponent } from '../../../../../../../base/base.component';

@Component({
  selector: 'cp-facebook-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class FacebookEventsUpdateComponent extends BaseComponent implements OnInit {
  @Input() clubId: number;
  @Input() storeId: number;
  @Input() stores: Array<any>;
  @Input() reload: Observable<boolean>;

  links;
  isEdited;
  buttonData;
  loading = true;
  form: FormGroup;
  deleteLink = '';

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private eventsService: EventsService
  ) {
    super();
  }

  buildForm() {
    this.form = this.fb.group({
      'links': this.fb.array(this.buildEventControls())
    });

    this.loading = false;

    this.form.valueChanges.subscribe(_ => {
      this.isEdited = true;
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false })
    });
  }

  buildEventControls() {
    let arr = [];

    this.links.map(link => {
      arr.push(this.buildEventControl(link));
    });

    return arr;
  }

  onBulkUpdate(data) {
    let search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    let _links = [];


    data.links.forEach(link => {
      _links.push({
        id: link.id,
        url: link.url,
        store_id: link.store_id
      });
    });

    this
      .eventsService
      .bulkUpdateFacebookEvents(_links, search)
      .subscribe(
      _ => this.fetch()
      );
  }

  onSelectedStore(store, index) {
    const controls = <FormArray>this.form.controls['links'];
    const control = <FormGroup>controls.controls[index];

    control.controls['store_id'].setValue(store.value);
  }

  buildEventControl(link) {
    return this.fb.group({
      'id': [link.id],
      'url': [link.url, Validators.required],
      'store_id': [link.store_id, Validators.required],
      'selected': [link.host]
    });
  }

  onDeleted() {
    this.fetch();
  }

  private fetch() {
    this.loading = true;
    this.isEdited = false;
    let search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    if (this.storeId) {
      search.append('store_id', this.storeId.toString());
    }

    if (this.clubId) {
      search.append('store_id', this.clubId.toString());
    }

    const links$ = this.eventsService.getFacebookEvents(search).map((links: any) => {
      let _links = [];

      links.map(link => {
        _links.push({
          id: link.id,
          url: link.url,
          store_id: link.store_id,
          host: {
            label: link.store_name,
            action: link.store_id
          }
        });
      });
      return _links;
    });

    super
      .fetchData(links$)
      .then(res => {
        this.links = res.data;
        this.buildForm();
      })
      .catch(_ => {});
  }

  ngOnInit() {
    this.fetch();

    this.buttonData = {
      class: 'primary',
      text: 'Update',
      disabled: true
    }

    this.reload.subscribe(res => {
      if (res) {
        this.fetch();
      }
    });
  }
}
