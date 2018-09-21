import { Injectable } from '@angular/core';
import { get as _get } from 'lodash';

import { ITile } from '../tiles/tile.interface';
import { CampusGuideId } from './section.status';
import { ICampusGuide, ICampusGuideBulk } from './section.interface';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

@Injectable()
export class SectionUtilsService {
  constructor(public cpI18n: CPI18nService) {}

  isTemporaryGuide(guide: ICampusGuide) {
    return _get(guide, '_temporary', false);
  }

  tileAtIndex(tiles: ITile[], index) {
    return tiles[index];
  }

  updateGuideTileRank(
    guide: ICampusGuide | ICampusGuideBulk,
    school_id: number,
    rankType: 'rank' | 'featured_rank'
  ) {
    const tiles = [...guide.tiles];

    return tiles.map((t: ITile, index) => {
      return {
        ...t,
        school_id,
        [rankType]: index + 1
      };
    });
  }

  temporaryGuide(rank = 1): ICampusGuide {
    return {
      rank,
      name: '',
      tiles: [],
      _temporary: true,
      id: CampusGuideId.temporary,
      name: this.cpI18n.translate('t_personas_create_section_default_name')
    };
  }
}
