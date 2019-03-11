import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { get as _get, sortBy } from 'lodash';
import { FileUploadService } from './../../../../../shared/services/file-upload.service';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { CampusLink } from './../../../manage/links/tile';
import { ICampusGuide } from './../sections/section.interface';
import { SectionUtilsService } from './../sections/section.utils.service';
import { ITile } from './tile.interface';
import { CampusLinkType, TileCategoryRank, TileFeatureRank, TileVisibility } from './tiles.status';
import { CPSession } from '../../../../../session';

const threeHundrendKb = 3e5;

@Injectable()
export class TilesUtilsService {
  static webAppSupportedLinkUrls = [
    CampusLink.campusService,
    CampusLink.store,
    CampusLink.jobList,
    CampusLink.storeList,
    CampusLink.schoolCampaign,
    CampusLink.eventList,
    CampusLink.campaignList,
    CampusLink.dealStoreList,
    CampusLink.campusServiceList,
    CampusLink.campusPoiList,
    CampusLink.campusSecurityService,
    CampusLink.campusLinkList,
    CampusLink.dining
  ];

  static deprecatedTiles = [
    CampusLink.cameraQr,
    CampusLink.examSearch,
    CampusLink.advisorList,
    CampusLink.inAppFeedback,
    CampusLink.campusTourList,
    CampusLink.attendedEventList,
    CampusLink.userSchoolCourseMaterialList
  ];

  defaultTileCategoryIds = [2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13];

  constructor(
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public sectionUtils: SectionUtilsService
  ) {}

  isTileDefault(tile: ITile) {
    return this.defaultTileCategoryIds.includes(tile.tile_category_id);
  }

  isTileWebLink(linkType: number) {
    return linkType === CampusLinkType.webLink;
  }

  isTileSupportedByWebApp(tile: ITile) {
    const supportedLinkUrls = TilesUtilsService.webAppSupportedLinkUrls;
    const linkUrl = _get(tile, ['related_link_data', 'link_url'], null);
    const linkType = _get(tile, ['related_link_data', 'link_type'], null);

    if (!linkUrl) {
      return false;
    }

    const webOrExternalLink = this.isTileWebLink(linkType);

    return webOrExternalLink || supportedLinkUrls.includes(linkUrl);
  }

  isCampaignTile(tile: ITile) {
    const linkUrl = _get(tile, ['related_link_data', 'link_url'], null);

    if (!linkUrl) {
      return false;
    }

    return (
      tile.related_link_data.link_url === CampusLink.schoolCampaign ||
      tile.related_link_data.link_url === CampusLink.campaignList
    );
  }

  isDeprecated(tile: ITile) {
    const linkUrl = _get(tile, ['related_link_data', 'link_url'], null);

    if (!linkUrl) {
      return false;
    }

    return TilesUtilsService.deprecatedTiles.includes(tile.related_link_data.link_url);
  }

  isFeatured(tile: ITile) {
    return tile.featured_rank > -1;
  }

  isTileVisible(tile: ITile) {
    return tile.visibility_status === TileVisibility.visible;
  }

  getLastFeaturedRank(guide: ICampusGuide) {
    return guide.tiles.length
      ? sortBy(guide.tiles, (t: ITile) => -t.featured_rank)[0].featured_rank + 1
      : 1;
  }

  getLastRank(guide: ICampusGuide) {
    const isTemporaryGuide = this.sectionUtils.isTemporaryGuide(guide);

    return isTemporaryGuide || !guide.tiles.length
      ? 1
      : sortBy(guide.tiles, (t: ITile) => -t.rank)[0].rank + 1;
  }

  campusGuideTileForm(personaId, guide: ICampusGuide, tileToEdit = null) {
    const lastFeaturedRank = this.getLastFeaturedRank(guide);

    const lastRank = this.getLastRank(guide);

    const _tile = tileToEdit
      ? { ...tileToEdit }
      : {
          name: null,
          rank: guide._featuredTile ? TileCategoryRank.hidden : lastRank,
          img_url: null,
          color: 'FFFFFF',
          extra_info: null,
          visibility_status: TileVisibility.visible,
          tile_category_id: guide._featuredTile ? 0 : guide.id,
          featured_rank: guide._featuredTile ? lastFeaturedRank : TileFeatureRank.notFeatured
        };

    return this.fb.group({
      school_id: [this.session.g.get('school').id, Validators.required],
      school_persona_id: [personaId, Validators.required],
      name: [_tile.name, Validators.required],
      rank: [_tile.rank, Validators.required],
      img_url: [_tile.img_url, Validators.required],
      color: [_tile.color, Validators.required],
      extra_info: [_tile.extra_info],
      visibility_status: [_tile.visibility_status],
      tile_category_id: [_tile.tile_category_id, null],
      featured_rank: [_tile.featured_rank, Validators.required]
    });
  }

  async validateTileImage(file: File, maxImageSize = threeHundrendKb): Promise<string> {
    let error;
    const validExtension = (media) => ['image/jpeg', 'image/jpg', 'image/png'].includes(media.type);
    const validSize = FileUploadService.validFileSize(file, maxImageSize);

    if (!validSize || !validExtension(file)) {
      error = !validSize
        ? this.cpI18n.translate('error_file_is_too_big')
        : this.cpI18n.translate('error_invalid_extension');
    }

    return error ? Promise.reject(error) : Promise.resolve(null);
  }

  linkParamsValidator(control: FormGroup): ValidationErrors | null {
    const linkParams = control.get('link_params').value;
    const linkUrl = control.get('link_url').value;

    if (linkUrl === CampusLink.campusServiceList) {
      const entries: any = Object.values(linkParams)[0];

      if (!entries) {
        return { invalid: true };
      }

      return entries.length ? null : { invalid: true };
    }

    return null;
  }

  campusLinkForm(nameRequired = true, imageRequired = true, link = null) {
    const _link = link
      ? { ...link }
      : {
          name: null,
          link_url: null,
          link_params: {},
          img_url: null,
          open_in_browser: 0,
          is_system: 1,
          school_id: this.session.g.get('school').id
        };

    return this.fb.group(
      {
        name: [_link.name, nameRequired ? Validators.required : null],
        link_url: [_link.link_url, Validators.required],
        link_params: [_link.link_params, Validators.required],
        img_url: [_link.img_url, imageRequired ? Validators.required : null],
        open_in_browser: [_link.open_in_browser],
        is_system: [_link.is_system],
        school_id: [_link.school_id, Validators.required]
      },
      { validator: this.linkParamsValidator }
    );
  }
}
