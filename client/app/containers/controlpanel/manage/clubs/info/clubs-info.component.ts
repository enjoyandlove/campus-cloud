import { Component, Input, OnInit } from '@angular/core';
import { Headers, URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { ClubStatus } from '../club.status';
import { API } from '../../../../../config/api';
import { ClubsService } from '../clubs.service';
import { CPSession } from '../../../../../session';
import { ClubsUtilsService } from '../clubs.utils.service';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { appStorage } from './../../../../../shared/utils/storage/storage';
import { clubAthleticLabels, isClubAthletic } from '../clubs.athletics.labels';
import { CPI18nService, FileUploadService } from '../../../../../shared/services';
import { ISnackbar, SNACKBAR_SHOW } from './../../../../../reducers/snackbar.reducer';

@Component({
  selector: 'cp-clubs-info',
  templateUrl: './clubs-info.component.html',
  styleUrls: ['./clubs-info.component.scss']
})
export class ClubsInfoComponent extends BaseComponent implements OnInit {
  @Input() isAthletic = isClubAthletic.club;

  club;
  labels;
  loading;
  clubStatus;
  clubId: number;
  draggable = false;
  uploading = false;
  hasMetaData = false;
  limitedAdmin = true;
  mapCenter: BehaviorSubject<any>;

  constructor(
    public session: CPSession,
    public route: ActivatedRoute,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    public clubsService: ClubsService,
    public helper: ClubsUtilsService,
    public fileService: FileUploadService
  ) {
    super();
    this.clubId = this.route.parent.snapshot.params['clubId'];

    super.isLoading().subscribe((res) => (this.loading = res));
  }

  fetch() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());
    search.append('category_id', this.isAthletic.toString());

    super.fetchData(this.clubsService.getClubById(this.clubId, search)).then((res) => {
      this.club = res.data;
      this.mapCenter = new BehaviorSubject({
        lat: res.data.latitude,
        lng: res.data.longitude
      });
      this.hasMetaData =
        !!this.club.contactphone ||
        !!this.club.email ||
        !!this.club.room_info ||
        !!this.club.location ||
        !!this.club.website ||
        !!this.club.address ||
        !!this.club.constitution_url ||
        !!this.club.advisor_firstname ||
        !!this.club.advisor_lastname ||
        !!this.club.advisor_email;

      this.store.dispatch({
        type: HEADER_UPDATE,
        payload: this.buildHeader(res.data.name)
      });
    });
  }

  flashMessageSuccess() {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        autoClose: true,
        body: this.cpI18n.translate('message_file_upload_success')
      }
    });
  }

  flashMessageError(body = this.cpI18n.translate('message_file_upload_error')) {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        body,
        class: 'danger',
        autoClose: true
      }
    });
  }

  onFileAdded(file) {
    const headers = new Headers();
    const search = new URLSearchParams();
    const validate = this.fileService.validFile(file);

    search.append('school_id', this.session.g.get('school').id.toString());
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.FILE_UPLOAD}/`;

    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;
    headers.append('Authorization', auth);

    if (!validate.valid) {
      this.flashMessageError(validate.errors.join(', '));

      return;
    }

    this.uploading = true;

    this.fileService
      .uploadFile(file, url, headers)
      .switchMap((data) => {
        this.club = Object.assign({}, this.club, {
          constitution_url: data.file_uri
        });

        return this.clubsService.updateClub(this.club, this.clubId, search);
      })
      .subscribe(
        (_) => {
          this.uploading = false;
          this.flashMessageSuccess();
        },
        (_) => {
          this.uploading = false;
          this.flashMessageError();
        }
      );
  }

  buildHeader(name) {
    const menu = {
      heading: `[NOTRANSLATE]${name}[NOTRANSLATE]`,
      crumbs: {
        url: this.labels.club_athletic,
        label: this.labels.club_athletic
      },
      subheading: null,
      em: null,
      children: []
    };

    const links = this.helper.getSubNavChildren(this.club, this.session);

    links.forEach((link) => {
      menu.children.push({
        label: link.toLocaleLowerCase(),
        url: `/manage/` + this.labels.club_athletic + `/${this.clubId}/${link.toLocaleLowerCase()}`
      });
    });

    return menu;
  }

  ngOnInit() {
    this.limitedAdmin =
      this.isAthletic === isClubAthletic.club
        ? this.helper.limitedAdmin(this.session.g, this.clubId)
        : false;

    this.labels = clubAthleticLabels(this.isAthletic);
    this.fetch();
    this.clubStatus = {
      [ClubStatus.inactive]: this.cpI18n.translate('clubs_inactive'),
      [ClubStatus.active]: this.cpI18n.translate('active'),
      [ClubStatus.pending]: this.cpI18n.translate('pending')
    };
  }
}
