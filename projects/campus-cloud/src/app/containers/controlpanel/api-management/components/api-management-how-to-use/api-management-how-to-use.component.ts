import { OnInit, Component } from '@angular/core';

import { ZendeskService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-api-how-to-use',
  templateUrl: './api-management-how-to-use.component.html',
  styleUrls: ['./api-management-how-to-use.component.scss']
})
export class ApiManagementHowToUseComponent implements OnInit {
  howToUsePkdbLink = `${ZendeskService.zdRoot()}/articles/360035456133`;

  constructor() {}

  ngOnInit() {}
}
