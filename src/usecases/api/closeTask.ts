import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { TenancyManagementInteraction } from '../../interfaces/tenancyManagementInteraction';
import { Result } from '../../lib/utils';

export interface CloseTaskInterface {
  execute(taskId: string, userEmail: string): Promise<Result<boolean>>;
}

class CloseTaskUseCase implements CloseTaskInterface {
  crmGateway: CrmGatewayInterface;
  v1ApiGateway: V1MatAPIGatewayInterface;
  matPostgresGateway: MatPostgresGatewayInterface;

  constructor(
    crmGateway: CrmGatewayInterface,
    v1ApiGateway: V1MatAPIGatewayInterface,
    matPostgresGateway: MatPostgresGatewayInterface
  ) {
    this.crmGateway = crmGateway;
    this.v1ApiGateway = v1ApiGateway;
    this.matPostgresGateway = matPostgresGateway;
  }

  public async execute(
    taskId: string,
    userEmail: string
  ): Promise<Result<boolean>> {
    // fetch task from crm
    const existingTask = await this.crmGateway.getTask(taskId);
    if (!existingTask || !existingTask.body)
      return new Error('Error fetching task from crm');

    // fetch current user from crm
    const officer = await this.matPostgresGateway.getUserMapping(userEmail);
    if (!officer || !officer.body)
      return new Error('Error fetching mapped user');

    // fetch patch data from crm
    const patch = await this.crmGateway.getPatchByOfficerId(
      officer.body.usercrmid
    );
    if (!patch || !patch.body) return new Error('Error fetching patch');

    const updateObject: TenancyManagementInteraction = {
      interactionId: taskId,
      estateOfficerName: officer.body.username,
      serviceRequest: {
        description: 'Closed task',
        requestCallback: false,
        id: existingTask.body.incidentId,
      },
      status: 0,
      estateOfficerId: officer.body.usercrmid,
    };

    const result = await this.v1ApiGateway.patchTenancyManagementInteraction(
      updateObject
    );

    if (result.body) {
      return true;
    } else {
      return new Error('Unknown error closing task');
    }
  }
}

export default CloseTaskUseCase;
