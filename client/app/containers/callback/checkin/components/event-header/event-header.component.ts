import { Component, Input, OnInit } from '@angular/core';

import { CPSession } from '@client/app/session';
import { FORMAT, CPDatePipe } from '@shared/pipes/date';
import { IResourceBanner } from '@client/app/shared/components';

@Component({
  selector: 'cp-event-header',
  templateUrl: './event-header.component.html',
  styleUrls: ['./event-header.component.scss']
})
export class CheckinEventHeaderComponent implements OnInit {
  @Input() event: any;

  datePipe: CPDatePipe;
  banner: IResourceBanner;

  constructor(private session: CPSession) {}

  ngOnInit() {
    this.datePipe = new CPDatePipe(this.session);

    const startDate = this.datePipe.transform(
      this.event.start,
      FORMAT.DATETIME,
      this.event.tz_zoneinfo_str
    );

    const endDate = this.datePipe.transform(
      this.event.end,
      FORMAT.DATETIME,
      this.event.tz_zoneinfo_str
    );

    this.banner = {
      heading: this.event.title,
      image: this.event.poster_thumb_url,
      subheading: `${startDate} - ${endDate}`
    };
  }
}
