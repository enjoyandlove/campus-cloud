import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-students-profile',
  templateUrl: './students-profile.component.html',
  styleUrls: ['./students-profile.component.scss']
})
export class StudentsProfileComponent implements OnInit {
  constructor() { }

  launchMessageModal() {
    console.log('messaging');
  }

  onFilter(filterBy) {
    console.log('filtering by', filterBy);
  }

  onDownload() {
    console.log('doing download');
  }

  ngOnInit() { }
}
