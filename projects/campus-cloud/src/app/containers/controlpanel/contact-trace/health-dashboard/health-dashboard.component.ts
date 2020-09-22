import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ContactTraceFeatureLevel, CPSession } from '@campus-cloud/session';

@Component({
  selector: 'cp-health-dashboard',
  templateUrl: './health-dashboard.component.html',
  styleUrls: ['./health-dashboard.component.scss']
})
export class HealthDashboardComponent implements OnInit, AfterViewInit {
  isContactTracePlus: boolean;
  @ViewChild('actionBox') actionBox: ElementRef;

  actionBoxTop: number;
  isActionBoxPinned = false;

  constructor(private session: CPSession) {}

  ngOnInit() {
    this.isContactTracePlus =
      this.session.g.get('school').contact_trace_feature_level === ContactTraceFeatureLevel.Plus;
  }

  ngAfterViewInit() {
    this.actionBoxTop = this.actionBox.nativeElement.getBoundingClientRect().top;
  }

  @HostListener('window:scroll')
  scrollHandler() {
    this.isActionBoxPinned = window.scrollY > this.actionBoxTop;
  }
}
