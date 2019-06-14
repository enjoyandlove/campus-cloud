import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { API } from '@campus-cloud/config/api';
import { CPSession } from '@campus-cloud/session';
import { ClubStatus } from '../club.status';
import { ClubsService } from '../clubs.service';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { baseActions, ISnackbar } from '@campus-cloud/store/base';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { appStorage } from '@campus-cloud/shared/utils/storage/storage';
import { ClubsUtilsService } from '../clubs.utils.service';
import { clubAthleticLabels, isClubAthletic } from '../clubs.athletics.labels';
import {
  CPI18nService,
  FileUploadService,
  AdminService,
  IAdmin
} from '@campus-cloud/shared/services';

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
  buttonText;
  clubId: number;
  schoolId: number;
  draggable = false;
  uploading = false;
  hasMetaData = false;
  limitedAdmin = true;
  showLocationDetails = true;
  mapCenter: BehaviorSubject<any>;
  admins$: Observable<IAdmin[]>;

  constructor(
    public session: CPSession,
    public route: ActivatedRoute,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    public helper: ClubsUtilsService,
    public clubsService: ClubsService,
    public adminService: AdminService,
    public fileService: FileUploadService
  ) {
    super();
    this.clubId = this.route.parent.snapshot.params['clubId'];

    super.isLoading().subscribe((res) => (this.loading = res));
  }

  fetch() {
    const clubSearch = new HttpParams()
      .append('school_id', this.schoolId.toString())
      .append('category_id', this.isAthletic.toString());

    super.fetchData(this.clubsService.getClubById(this.clubId, clubSearch)).then((res) => {
      this.club = res.data;
      this.showLocationDetails = res.data.latitude !== 0 && res.data.longitude !== 0;
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
        type: baseActions.HEADER_UPDATE,
        payload: this.buildHeader(res.data.name)
      });
    });

    const adminSearch = new HttpParams()
      .append('school_id', this.schoolId.toString())
      .append('store_id', this.clubId.toString())
      .append('privilege_type', CP_PRIVILEGES_MAP.clubs.toString());
    this.admins$ = this.adminService
      .getAdminByStoreId(adminSearch)
      .pipe(map((admins: IAdmin[]) => admins.filter((admin) => !admin.is_school_level)));
  }

  flashMessageSuccess() {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        autoClose: true,
        body: this.cpI18n.translate('message_file_upload_success')
      }
    });
  }

  flashMessageError(body = this.cpI18n.translate('message_file_upload_error')) {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        body,
        class: 'danger',
        autoClose: true
      }
    });
  }

  onFileAdded(file) {
    const validate = this.fileService.validFile(file);
    const search = new HttpParams().append('school_id', this.schoolId.toString());
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.FILE_UPLOAD}/`;

    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;
    const headers = new HttpHeaders({
      Authorization: auth
    });

    if (!validate.valid) {
      this.flashMessageError(validate.errors.join(', '));

      return;
    }

    this.uploading = true;

    this.fileService
      .uploadFile(file, url, headers)
      .pipe(
        switchMap((data: any) => {
          this.club = Object.assign({}, this.club, {
            constitution_url: data.file_uri
          });

          return this.clubsService.updateClub(this.club, this.clubId, search);
        })
      )
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
        amplitude: link,
        isSubMenuItem: true,
        label: link.toLocaleLowerCase(),
        url: `/manage/` + this.labels.club_athletic + `/${this.clubId}/${link.toLocaleLowerCase()}`
      });
    });

    return menu;
  }

  ngOnInit() {
    this.schoolId = this.session.g.get('school').id;
    this.buttonText = this.cpI18n.translate('reupload');
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
