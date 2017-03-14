import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'cp-links-list',
  templateUrl: './links-list.component.html',
  styleUrls: ['./links-list.component.scss']
})
export class LinksListComponent implements OnInit {
  constructor() { }

  onSearch() {
    console.log('doing Search');
  }

  onLaunchCreateModal() {
    $('#linksCreate').modal();
  }

  ngOnInit() { }
}
