import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { JsonObject } from '@backstage/types';

import { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';

import {
  AssessedProcessInstanceDTO,
  DefaultApi,
  ExecuteWorkflowResponseDTO,
  ProcessInstanceListResultDTO,
  WorkflowOverviewDTO,
  WorkflowOverviewListResultDTO,
} from '@janus-idp/backstage-plugin-orchestrator-common';

import { OrchestratorApi } from './api';

export interface OrchestratorClientOptions {
  discoveryApi: DiscoveryApi;
  identityApi: IdentityApi;
  defaultApi: DefaultApi;
}
export class OrchestratorClient implements OrchestratorApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;
  private readonly orchestratorApi: DefaultApi;
  private baseUrl: string | null = null;
  constructor(options: OrchestratorClientOptions) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
    this.orchestratorApi = options.defaultApi;
  }

  private async getBaseUrl(): Promise<string> {
    if (!this.baseUrl) {
      this.baseUrl = await this.discoveryApi.getBaseUrl('orchestrator');
    }

    return this.baseUrl;
  }

  async executeWorkflow(args: {
    workflowId: string;
    parameters: JsonObject;
    businessKey?: string;
  }): Promise<AxiosResponse<ExecuteWorkflowResponseDTO>> {
    const additionalHeaders = new AxiosHeaders({
      'Content-Type': 'application/json',
    });
    const reqConfigOption: AxiosRequestConfig =
      await this.getDefaultReqConfig(additionalHeaders);
    try {
      return await this.orchestratorApi.executeWorkflow(
        args.workflowId,
        JSON.stringify(args.parameters),
        args.businessKey,
        reqConfigOption,
      );
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async abortWorkflowInstance(
    instanceId: string,
  ): Promise<AxiosResponse<string>> {
    const reqConfigOption: AxiosRequestConfig =
      await this.getDefaultReqConfig();
    try {
      return await this.orchestratorApi.abortWorkflow(
        instanceId,
        reqConfigOption,
      );
    } catch (error: any) {
      throw new Error(error);
    }
  }

  // async getWorkflowDefinition(workflowId: string): Promise<WorkflowDefinition> {
  //   const reqConfigOption: AxiosRequestConfig = await this.getDefaultReqConfig();
  //   try {
  //     return await this.orchestratorApi.ge(
  //       workflowId,
  //       reqConfigOption
  //     )
  //   } catch (error: any) {
  //     throw new Error(error);
  //   }
  // }

  async getWorkflowSource(workflowId: string): Promise<AxiosResponse<string>> {
    const reqConfigOption: AxiosRequestConfig =
      await this.getDefaultReqConfig();
    try {
      return await this.orchestratorApi.getWorkflowSourceById(
        workflowId,
        reqConfigOption,
      );
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async listWorkflowOverviews(
    page?: number,
    pageSize?: number,
    orderBy?: string,
    orderDirection?: string,
  ): Promise<AxiosResponse<WorkflowOverviewListResultDTO, any>> {
    const reqConfigOption: AxiosRequestConfig =
      await this.getDefaultReqConfig();
    try {
      return await this.orchestratorApi.getWorkflowsOverview(
        page,
        pageSize,
        orderBy,
        orderDirection,
        reqConfigOption,
      );
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async listInstances(
    page?: number,
    pageSize?: number,
    orderBy?: string,
    orderDirection?: string,
  ): Promise<AxiosResponse<ProcessInstanceListResultDTO, any>> {
    const reqConfigOption: AxiosRequestConfig =
      await this.getDefaultReqConfig();
    try {
      return await this.orchestratorApi.getInstances(
        page,
        pageSize,
        orderBy,
        orderDirection,
        reqConfigOption,
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getInstance(
    instanceId: string,
    includeAssessment = false,
  ): Promise<AxiosResponse<AssessedProcessInstanceDTO>> {
    const reqConfigOption: AxiosRequestConfig =
      await this.getDefaultReqConfig();
    try {
      return await this.orchestratorApi.getInstanceById(
        instanceId,
        includeAssessment,
        reqConfigOption,
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // async getWorkflowDataInputSchema(args: {
  //   workflowId: string;
  //   instanceId?: string;
  //   assessmentInstanceId?: string;
  // }): Promise<WorkflowInputSchemaResponse> {
  //   const baseUrl = await this.getBaseUrl();
  //   const endpoint = `${baseUrl}/workflows/${args.workflowId}/inputSchema`;
  //   const urlToFetch = buildUrl(endpoint, {
  //     [QUERY_PARAM_INSTANCE_ID]: args.instanceId,
  //     [QUERY_PARAM_ASSESSMENT_INSTANCE_ID]: args.assessmentInstanceId,
  //   });
  //   return await this.fetcher(urlToFetch).then(r => r.json());
  // }

  async getWorkflowOverview(
    workflowId: string,
  ): Promise<AxiosResponse<WorkflowOverviewDTO>> {
    const reqConfigOption: AxiosRequestConfig =
      await this.getDefaultReqConfig();
    try {
      return await this.orchestratorApi.getWorkflowOverviewById(
        workflowId,
        reqConfigOption,
      );
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async retriggerInstanceInError(args: {
    instanceId: string;
    inputData: JsonObject;
  }): Promise<AxiosResponse<ExecuteWorkflowResponseDTO>> {
    const additionalHeaders = new AxiosHeaders({
      'Content-Type': 'application/json',
    });
    const reqConfigOption: AxiosRequestConfig =
      await this.getDefaultReqConfig(additionalHeaders);

    try {
      return await this.orchestratorApi.retriggerInstanceById(
        args.instanceId,
        args.inputData,
        reqConfigOption,
      );
    } catch (error: any) {
      throw new Error(error);
    }
  }
  // const baseUrl = await this.getBaseUrl();
  // const urlToFetch = `${baseUrl}/instances/${args.instanceId}/retrigger`;
  // return await this.fetcher(urlToFetch, {
  //   method: 'POST',
  //   body: JSON.stringify(args.inputData),
  //   headers: { 'Content-Type': 'application/json' },
  // }).then(r => r.json());
  // }

  // /** fetcher is convenience fetch wrapper that includes authentication
  //  * and other necessary headers **/
  // private async fetcher(
  //   url: string,
  //   requestInit?: RequestInit,
  // ): Promise<Response> {
  //   const { token: idToken } = await this.identityApi.getCredentials();
  //   const r = { ...requestInit };
  //   r.headers = {
  //     ...r.headers,
  //     ...(idToken && { Authorization: `Bearer ${idToken}` }),
  //   };
  //   const response = await fetch(url, r);
  //   if (!response.ok) {
  //     throw await ResponseError.fromResponse(response);
  //   }
  //   return response;
  // }

  // getDefaultReqConfig is a convenience wrapper that includes authentication and other necessary headers
  private async getDefaultReqConfig(
    additionalHeaders?: AxiosHeaders,
  ): Promise<AxiosRequestConfig> {
    const idToken = await this.identityApi.getCredentials();
    const reqConfigOption: AxiosRequestConfig = {
      baseURL: await this.getBaseUrl(),
      headers: {
        Authorization: `Bearer ${idToken.token}`,
        ...additionalHeaders,
      },
    };
    return reqConfigOption;
  }
}
