import axios, { AxiosError } from 'axios';
import CrmTokenGateway, { CrmTokenGatewayInterface } from './crmTokenGateway';
import { Tenancy } from '../interfaces/tenancy';
import { TenancyManagementInteraction } from '../interfaces/tenancyManagementInteraction';
import { crmResponseToTask, crmResponseToTasks } from '../mappings/crmToTask';
import getTasksByPatchIdQuery from './xmlQueryStrings/getTasksByPatchId';
import getTaskById from './xmlQueryStrings/getTaskById';

export interface v1MatAPIGatewayInterface {
  getNewTenancies(): Promise<GetNewTenanciesResponse>;
  createTenancyManagementInteraction(
    tmi: TenancyManagementInteraction
  ): Promise<createTenancyManagementInteractionResponse>;
}

interface GetNewTenanciesResponse {
  body: Tenancy[] | undefined;
  error: string | undefined;
}

interface createTenancyManagementInteractionResponse {
  body: any | undefined;
  error: string | undefined;
}

class v1MatAPIGateway implements v1MatAPIGatewayInterface {
  public async getNewTenancies(): Promise<GetNewTenanciesResponse> {
    const response = await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`,
        {
          headers: {
            Authorization: `Bearer ${this.crmApiToken.token}`,
          },
        }
      )
      .then((response) => {
        const task = response.data as GetNewTenanciesResponse;

        return {
          body: task,
          error: undefined,
        };
      })
      .catch((error: AxiosError) => {
        return {
          body: undefined,
          error: error.message,
        };
      });

    return response;
  }

  public async createTenancyManagementInteraction(
    tmi: TenancyManagementInteraction
  ): Promise<createTenancyManagementInteractionResponse> {
    return {
      body: [],
      error: undefined,
    };
  }
}

export default v1MatAPIGateway;
