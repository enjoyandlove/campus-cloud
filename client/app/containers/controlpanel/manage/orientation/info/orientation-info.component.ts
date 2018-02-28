import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// import { OrientationService } from '../orientation.services';
import { BaseComponent } from '../../../../../base';

@Component({
  selector: 'cp-orientation-info',
  templateUrl: './orientation-info.component.html',
  styleUrls: ['./orientation-info.component.scss']
})

export class OrientationInfoComponent extends BaseComponent implements OnInit {

  loading;
  selectedProgram = [];
  orientationId: number;
  launchEditModal = false;

  @Input() isOrientation = true;

  constructor(
    private route: ActivatedRoute,
    // private service: OrientationService
  ) {
    super();
    this.orientationId = this.route.parent.snapshot.params['orientationId'];

    super.isLoading().subscribe(() => (this.loading = true));
  }

  onLaunchEditModal() {
    this.launchEditModal = true;

    setTimeout(
      () => {
        $('#programEdit').modal();
      },
      1,
    );
  }

  ngOnInit() {}

}
