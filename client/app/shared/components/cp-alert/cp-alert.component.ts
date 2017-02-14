import { Component, OnInit, Input } from '@angular/core';

export interface IAlert {
  class: string;
  message: string;
}

@Component({
  selector: 'cp-alert',
  templateUrl: './cp-alert.component.html',
  styleUrls: ['./cp-alert.component.css']
})
export class CPAlertComponent implements OnInit {
  @Input() data: IAlert;

  constructor() { }

  ngOnInit() { }

  handleResponse(res) {
    switch (res.code) {
      case 400:
        return 'The request could not be processed due to an error in the request';
      case 401:
        return 'The request failed to authenticate';
      case 403:
        return 'The requested action is now allowed';
      case 405:
        return 'The request method is not allowed on the resource';
      case 500:
        return 'The request could not be processed due to an unexpected server error';
      case 503:
        return 'The request was denied processing';
    }
  }
}
