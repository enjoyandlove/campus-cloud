import { Injectable } from '@angular/core';

import { IIntegrationData, ExtraDataType, IExtraData } from '../../models';

@Injectable()
export class IntegrationDataUtils {
  constructor() {}

  private static findExtraData(integrationData: IIntegrationData, type: ExtraDataType) {
    return integrationData.extra_data.find(
      (extraData: IExtraData) => extraData.extra_data_type === type
    );
  }

  static getExtraData(integrations: IIntegrationData[], type: ExtraDataType): IExtraData {
    const integration = integrations.find(
      (integrationData: IIntegrationData) => !!this.findExtraData(integrationData, type)
    );
    return integration ? this.findExtraData(integration, type) : undefined;
  }
}
