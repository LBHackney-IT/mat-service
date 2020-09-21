import axios, { AxiosError } from 'axios';
import { Tenancy } from '../interfaces/tenancy';
import V1ApiContact from '../interfaces/v1ApiContact';
import { TenancyManagementInteraction } from '../interfaces/tenancyManagementInteraction';

export interface V1MatAPIGatewayInterface {
  getNewTenancies(): Promise<GetNewTenanciesResponse>;
  createTenancyManagementInteraction(
    tmi: TenancyManagementInteraction
  ): Promise<CreateTenancyManagementInteractionResponse>;
  getContactsByUprn(uprn: string): Promise<GetContactsByUprnResponse>;
  transferCall(
    tmi: TenancyManagementInteraction
  ): Promise<TransferCallResponse>;
}

export interface GetNewTenanciesResponse {
  result: Tenancy[] | undefined;
  error: string | undefined;
}

export interface CreateTenancyManagementInteractionResponse {
  body?: TenancyManagementInteraction;
  error?: string;
}

export interface V1MatAPIGatewayOptions {
  v1MatApiUrl: string;
  v1MatApiToken: string;
}

interface GetContactsByUprnAPIResponse {
  results?: V1ApiContact[];
  error?: string;
}

export interface GetContactsByUprnResponse {
  body?: V1ApiContact[];
  error?: string;
}

export interface GetAreaPatchResponse {
  body?: any;
  error?: string;
}

export interface TransferCallResponse {
  body?: boolean;
  error?: string;
}

export default class V1MatAPIGateway implements V1MatAPIGatewayInterface {
  v1MatApiUrl: string;
  v1MatApiToken: string;

  constructor(options: V1MatAPIGatewayOptions) {
    this.v1MatApiUrl = options.v1MatApiUrl;
    this.v1MatApiToken = options.v1MatApiToken;
  }

  public async getNewTenancies(): Promise<GetNewTenanciesResponse> {
    const response = await axios
      .get(`${this.v1MatApiUrl}/v1/tenancy/new`, {
        headers: {
          Authorization: `Bearer ${this.v1MatApiToken}`,
        },
      })
      .then((response) => {
        return <GetNewTenanciesResponse>(<unknown>response);
      })
      .catch((error: AxiosError) => {
        return {
          error: error.message,
          result: undefined,
        };
      });

    return response;
  }

  public async createTenancyManagementInteraction(
    tmi: TenancyManagementInteraction
  ): Promise<CreateTenancyManagementInteractionResponse> {
    const response = await axios
      .post(
        `${this.v1MatApiUrl}/v1/TenancyManagementInteractions/CreateTenancyManagementInteraction`,
        tmi,
        {
          headers: {
            Authorization: `Bearer ${this.v1MatApiToken}`,
          },
        }
      )
      .then((response) => {
        return {
          body: response.data as TenancyManagementInteraction,
        };
      })
      .catch((error: AxiosError) => {
        return {
          error: `V1 API: ${error.message}`,
        };
      });

    return response;
  }

  public async getContactsByUprn(
    uprn: string
  ): Promise<GetContactsByUprnResponse> {
    // Note: urpn is not a typo here - the v1 MaT API contains the typo and we have to use it
    const response = await axios
      .get(`${this.v1MatApiUrl}/v1/Contacts/GetContactsByUprn?urpn=${uprn}`, {
        headers: {
          Authorization: `Bearer ${this.v1MatApiToken}`,
        },
      })
      .then((response) => {
        const data = response.data as GetContactsByUprnAPIResponse;
        return {
          body: data.results,
          error: undefined,
        };
      })
      .catch((error: AxiosError) => {
        return {
          error: error.message,
        };
      });

    return response;
  }

  public async getAreaPatch(
    uprn: string,
    postcode: string
  ): Promise<GetAreaPatchResponse> {
    const response = await axios
      .get(
        `${this.v1MatApiUrl}/v1/AreaPatch/GetAreaPatch?postcode=${postcode}&uprn=${uprn}`,
        {
          headers: {
            Authorization: `Bearer ${this.v1MatApiToken}`,
          },
        }
      )
      .then((response) => {
        const data = response.data;
        return {
          body: data.result,
          error: undefined,
        };
      })
      .catch((error: AxiosError) => {
        return {
          error: error.message,
        };
      });

    return response;
  }
  public async transferCall(
    tmi: TenancyManagementInteraction
  ): Promise<TransferCallResponse> {
    const response = await axios
      .put(
        `${this.v1MatApiUrl}/v1/TenancyManagementInteractions/TransferCall`,
        tmi,
        {
          headers: {
            Authorization: `Bearer ${this.v1MatApiToken}`,
          },
        }
      )
      .then(() => {
        return {
          body: true,
        };
      })
      .catch((error: AxiosError) => {
        return {
          error: error.message,
        };
      });

    return response;
  }
}
