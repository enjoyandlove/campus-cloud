import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { getHeaderState, IHeader } from '@campus-cloud/store';
import { select, Store } from '@ngrx/store';
import { ContactTraceHeaderService } from '@controlpanel/contact-trace/utils';

@Component({
  selector: 'cp-contact-trace',
  templateUrl: './contact-trace.component.html',
  styleUrls: ['./contact-trace.component.scss']
})
export class ContactTraceComponent implements OnInit {
  headerData$: Observable<IHeader> = this.store.pipe(select(getHeaderState));

  constructor(private store: Store<any>, private headerService: ContactTraceHeaderService) {}

  ngOnInit() {
    this.headerService.updateHeader();
  }
}
