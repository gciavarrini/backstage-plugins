import { createApiRef } from '@backstage/core-plugin-api';
import { JsonObject } from '@backstage/types';

import {
  AssessedProcessInstance,
  ProcessInstance,
  WorkflowDefinition,
  WorkflowExecutionResponse,
  WorkflowInputSchemaResponse,
  WorkflowOverview,
  WorkflowOverviewDTO,
  WorkflowOverviewListResult,
  WorkflowOverviewListResultDTO,
} from '@janus-idp/backstage-plugin-orchestrator-common';

export interface OrchestratorApi {
  abortWorkflowInstance(instanceId: string): Promise<void>;

  executeWorkflow(args: {
    workflowId: string;
    parameters: JsonObject;
    businessKey?: string;
  }): Promise<WorkflowExecutionResponse>;

  retriggerInstanceInError(args: {
    instanceId: string;
    inputData: JsonObject;
  }): Promise<WorkflowExecutionResponse>;

  getWorkflowDefinition(workflowId: string): Promise<WorkflowDefinition>;

  getWorkflowSource(workflowId: string): Promise<string>;

  getInstance(
    instanceId: string,
    includeAssessment: boolean,
  ): Promise<AssessedProcessInstance>;

  getWorkflowDataInputSchema(args: {
    workflowId: string;
    instanceId?: string;
    assessmentInstanceId?: string;
  }): Promise<WorkflowInputSchemaResponse>;

  getWorkflowOverview(workflowId: string): Promise<WorkflowOverview>;

  listWorkflowOverviews(): Promise<WorkflowOverviewListResult>;

  listInstances(): Promise<ProcessInstance[]>;

  // v2 endpoints
  getWorkflowOverviewV2(
    workflowId: string,
  ): Promise<WorkflowOverviewDTO | undefined>;

  listWorkflowOverviewsV2(): Promise<WorkflowOverviewListResultDTO | undefined>;
}

export const orchestratorApiRef = createApiRef<OrchestratorApi>({
  id: 'plugin.orchestrator.api',
});
