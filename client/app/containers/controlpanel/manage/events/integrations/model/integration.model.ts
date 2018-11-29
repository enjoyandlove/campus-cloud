import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export enum IntegrationStatus {
  successful = 1,
  error = -1,
  pending = 0
}

export enum IntegrationTypes {
  rss = 1,
  atom = 2,
  ical = 3
}

export class EventIntegration {
  static readonly types = IntegrationTypes;

  static readonly status = IntegrationStatus;

  public readonly id;
  public store_id: number;
  public feed_url: number;
  public school_id: number;
  public poster_url: string;
  public poster_thumb_url: string;
  public last_successful_sync_epoch: number;
  public feed_type: IntegrationTypes = IntegrationTypes.rss;
  public sync_status: IntegrationStatus = IntegrationStatus.pending;

  _form: FormGroup;

  get form(): FormGroup {
    return this._form ? this._form : this.buildForm();
  }

  constructor({ ...event } = {}) {
    this.id = event['id'] || null;
    this.feed_url = event['feed_url'] || null;
    this.store_id = event['store_id'] || null;
    this.school_id = event['school_id'] || null;
    this.poster_url = event['poster_url'] || null;
    this.poster_thumb_url = event['poster_thumb_url'] || null;
    this.feed_type = event['feed_type'] || IntegrationTypes.rss;
    this.sync_status = event['sync_status'] || IntegrationStatus.pending;
    this.last_successful_sync_epoch = event['last_successful_sync_epoch'] || null;
  }

  private buildForm(): FormGroup {
    const fb = new FormBuilder();

    this._form = fb.group({
      school_id: [this.school_id, Validators.required],
      store_id: [this.store_id, Validators.required],
      feed_url: [this.feed_url, Validators.required],
      feed_type: [this.feed_type, Validators.required],
      poster_url: [this.poster_url],
      poster_thumb_url: [this.poster_thumb_url],
      sync_status: [this.sync_status],
      last_successful_sync_epoch: [this.last_successful_sync_epoch]
    });

    return this._form;
  }
}
