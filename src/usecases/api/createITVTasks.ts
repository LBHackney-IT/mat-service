import v1MatAPIGateway, {
  v1MatAPIGatewayInterface,
} from '../../gateways/v1MatAPIGateway';
import { Tenancy } from '../../interfaces/tenancy';

interface CreateITVTasksResponse {
  body: any | undefined;
  error: number | undefined;
}

interface CreateITVTasksInterface {
  execute(): Promise<CreateITVTasksResponse>;
}

class CreateITVTasks implements CreateITVTasksInterface {
  v1MatAPIGateway: v1MatAPIGatewayInterface;

  constructor() {
    this.v1MatAPIGateway = new v1MatAPIGateway();
  }

  public async execute(): Promise<CreateITVTasksResponse> {
    const response = await this.v1MatAPIGateway.getNewTenancies();

    switch (response.error) {
      case undefined:
        return {
          body: response.body,
          error: undefined,
        };
      case 'NotAuthorised':
        return {
          body: undefined,
          error: 401,
        };
      default:
        return {
          body: undefined,
          error: 500,
        };
    }
  }
}

export default CreateITVTasks;
