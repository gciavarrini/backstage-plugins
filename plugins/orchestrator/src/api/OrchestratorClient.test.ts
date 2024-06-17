import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { JsonObject } from '@backstage/types';

import {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import {
  AssessedProcessInstanceDTO,
  DefaultApi,
  ExecuteWorkflowResponseDTO,
  ProcessInstanceListResultDTO,
  WorkflowOverviewDTO,
  WorkflowOverviewListResultDTO,
} from '@janus-idp/backstage-plugin-orchestrator-common';

import {
  OrchestratorClient,
  OrchestratorClientOptions,
} from './OrchestratorClient';

describe('OrchestratorClient', () => {
  let mockDiscoveryApi: jest.Mocked<DiscoveryApi>;
  let mockIdentityApi: jest.Mocked<IdentityApi>;
  let mockDefaultApi: jest.Mocked<DefaultApi>;
  let orchestratorClientOptions: jest.Mocked<OrchestratorClientOptions>;
  let orchestratorClient: OrchestratorClient;

  const baseUrl = 'https://api.example.com';
  const mockToken = 'test-token';

  const getDefaultTestRequestConfig: AxiosRequestConfig = {
    baseURL: baseUrl,
    headers: { Authorization: `Bearer ${mockToken}` },
  } as AxiosRequestConfig;

  const getDefaultTestRequestConfigWithJSON: AxiosRequestConfig = {
    ...getDefaultTestRequestConfig,
    headers: {
      ...getDefaultTestRequestConfig.headers,
      'Content-Type': 'application/json',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Create a mock DiscoveryApi with a mocked implementation of getBaseUrl
    mockDiscoveryApi = {
      getBaseUrl: jest.fn().mockResolvedValue(baseUrl),
      // getInstance: jest.fn(),
      // getWorkflowsOverview: jest.fn(),
      // executeWorkflow: jest.fn(),
      // abortWorkflow: jest.fn(),
      // getWorkflowSourceById: jest.fn(),
      // getInstances: jest.fn(),
      // getInstanceById: jest.fn(),
      // getWorkflowOverviewById: jest.fn(),
      // retriggerInstanceById: jest.fn(),
    } as jest.Mocked<DiscoveryApi>;

    mockIdentityApi = {
      getCredentials: jest.fn().mockResolvedValue({ token: mockToken }),
      getProfileInfo: jest
        .fn()
        .mockResolvedValue({ displayName: 'test', email: 'test@test' }),
      getBackstageIdentity: jest
        .fn()
        .mockResolvedValue({ userEntityRef: 'default/test' }),
      signOut: jest.fn().mockImplementation(),
    } as jest.Mocked<IdentityApi>;

    // Create OrchestratorClientOptions with the mocked DiscoveryApi
    orchestratorClientOptions = {
      discoveryApi: mockDiscoveryApi,
      identityApi: mockIdentityApi,
      defaultApi: new DefaultApi(),
    };
    orchestratorClient = new OrchestratorClient(orchestratorClientOptions);
  });

  describe('listWorkflowOverviews', () => {
    it('should return workflow overviews when successful', async () => {
      // Given
      const mockWorkflowOverviews: WorkflowOverviewListResultDTO = {
        overviews: [
          { workflowId: 'workflow123', name: 'Workflow 1' },
          { workflowId: 'workflow456', name: 'Workflow 2' },
        ],
        paginationInfo: {},
      };

      // Type 'SpyInstance<Promise<AxiosResponse<WorkflowOverviewListResultDTO, any>>, [page?: number | undefined, pageSize?: number | undefined, orderBy?: string | undefined, orderDirection?: string | undefined, options?: RawAxiosRequestConfig | undefined], any>' is not assignable to type 'Mocked<DefaultApi>'.
      // Type 'SpyInstance<Promise<AxiosResponse<WorkflowOverviewListResultDTO, any>>, [page?: number | undefined, pageSize?: number | undefined, orderBy?: string | undefined, orderDirection?: string | undefined, options?: RawAxiosRequestConfig | undefined], any>' is missing the following properties from type '{ abortWorkflow: MockInstance<Promise<AxiosResponse<string, any>>, [instanceId: string, options?: RawAxiosRequestConfig | undefined], unknown>; ... 9 more ...; retriggerInstanceById: MockInstance<...>; }': abortWorkflow, executeWorkflow, getInstanceById, getInstances, and 7 more.ts(2322)

      mockDefaultApi = jest
        .spyOn(DefaultApi.prototype, 'getWorkflowsOverview')
        .mockImplementation(() => {
          const mockResponse: AxiosResponse<WorkflowOverviewListResultDTO> = {
            data: mockWorkflowOverviews,
            status: 200, // Set status code (optional)
            statusText: 'OK', // Set status text (optional)
            headers: {} as AxiosHeaders,
            config: {} as InternalAxiosRequestConfig,
          };
          return Promise.resolve(mockResponse);
        });

      // When
      const result = await orchestratorClient.listWorkflowOverviews();

      // Then
      expect(result.data).toEqual(mockWorkflowOverviews);
      expect(mockDefaultApi).toHaveBeenCalledTimes(1);
      expect(mockDefaultApi).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        undefined,
        getDefaultTestRequestConfig,
      );
    });

    it('should throw a ResponseError when listing workflow overviews fails', async () => {
      // Given

      mockDefaultApi = jest
        .spyOn(DefaultApi.prototype, 'getWorkflowsOverview')
        .mockImplementationOnce(() => {
          return Promise.reject(new Error('Simulated error'));
        });
      // When
      const promise = orchestratorClient.listWorkflowOverviews();

      // Then
      await expect(promise).rejects.toThrow();
    });
  });
  describe('executeWorkflow', () => {
    it('should execute workflow with empty parameters', async () => {
      // Given
      const workflowId = 'workflow123';
      const executionId = 'execId001';
      const parameters: JsonObject = {};
      const args = {
        workflowId: workflowId,
        parameters: parameters,
      };

      const mockExecuteWorkflowResponse: ExecuteWorkflowResponseDTO = {
        id: executionId,
      };

      mockDefaultApi = jest
        .spyOn(DefaultApi.prototype, 'executeWorkflow')
        .mockImplementationOnce(() => {
          const mockResponse: AxiosResponse<ExecuteWorkflowResponseDTO> = {
            data: mockExecuteWorkflowResponse,
            status: 200, // Set status code (optional)
            statusText: 'OK', // Set status text (optional)
            headers: {} as AxiosHeaders,
            config: {} as InternalAxiosRequestConfig,
          };
          return Promise.resolve(mockResponse);
        });

      // When
      const result = await orchestratorClient.executeWorkflow(args);

      // Then
      expect(result).toBeDefined();
      expect(result.data.id).toBeDefined();
      expect(result.data.id).toEqual(executionId);
      expect(mockDefaultApi).toHaveBeenCalledTimes(1);
      expect(mockDefaultApi).toHaveBeenCalledWith(
        args.workflowId,
        JSON.stringify(args.parameters),
        undefined,
        getDefaultTestRequestConfigWithJSON,
      );
    });
    it('should execute workflow with business key', async () => {
      // Given
      const workflowId = 'workflow123';
      const businessKey = 'business123';
      const executionId = 'execId001';
      const parameters: JsonObject = {};
      const args = {
        workflowId: workflowId,
        parameters: parameters,
        businessKey: businessKey,
      };

      const mockExecuteWorkflowResponse: ExecuteWorkflowResponseDTO = {
        id: executionId,
      };

      mockDefaultApi = jest
        .spyOn(DefaultApi.prototype, 'executeWorkflow')
        .mockImplementationOnce(() => {
          const mockResponse: AxiosResponse<ExecuteWorkflowResponseDTO> = {
            data: mockExecuteWorkflowResponse,
            status: 200, // Set status code (optional)
            statusText: 'OK', // Set status text (optional)
            headers: {} as AxiosHeaders,
            config: {} as InternalAxiosRequestConfig,
          };
          return Promise.resolve(mockResponse);
        });

      // When
      const result = await orchestratorClient.executeWorkflow(args);

      // Then
      expect(result).toBeDefined();
      expect(result.data.id).toBeDefined();
      expect(result.data.id).toEqual(executionId);
      expect(mockDefaultApi).toHaveBeenCalledTimes(1);
      expect(mockDefaultApi).toHaveBeenCalledWith(
        args.workflowId,
        JSON.stringify(args.parameters),
        args.businessKey,
        getDefaultTestRequestConfigWithJSON,
      );
    });
    it('should execute workflow with parameters and business key', async () => {
      // Given
      const workflowId = 'workflow123';
      const businessKey = 'business123';
      const executionId = 'execId001';
      const parameters: JsonObject = {
        param1: 'one',
        param2: 2,
        param3: true,
      };
      const args = {
        workflowId: workflowId,
        parameters: parameters,
        businessKey: businessKey,
      };

      const mockExecuteWorkflowResponse: ExecuteWorkflowResponseDTO = {
        id: executionId,
      };

      mockDefaultApi = jest
        .spyOn(DefaultApi.prototype, 'executeWorkflow')
        .mockImplementationOnce(() => {
          const mockResponse: AxiosResponse<ExecuteWorkflowResponseDTO> = {
            data: mockExecuteWorkflowResponse,
            status: 200, // Set status code (optional)
            statusText: 'OK', // Set status text (optional)
            headers: {} as AxiosHeaders,
            config: {} as InternalAxiosRequestConfig,
          };
          return Promise.resolve(mockResponse);
        });

      // When
      const result = await orchestratorClient.executeWorkflow(args);

      // Then
      expect(result).toBeDefined();
      expect(result.data.id).toBeDefined();
      expect(result.data.id).toEqual(executionId);
      expect(mockDefaultApi).toHaveBeenCalledTimes(1);
      expect(mockDefaultApi).toHaveBeenCalledWith(
        args.workflowId,
        JSON.stringify(args.parameters),
        args.businessKey,
        getDefaultTestRequestConfigWithJSON,
      );
    });

    it('should throw a ResponseError if execute workflow fails', async () => {
      // Given
      const workflowId = 'workflow123';
      const businessKey = 'business123';
      const parameters: JsonObject = {
        param1: 'one',
        param2: 2,
        param3: true,
      };
      const args = {
        workflowId: workflowId,
        parameters: parameters,
        businessKey: businessKey,
      };
      const notFoundError = new AxiosError('Not Found', '404');
      mockDefaultApi = jest
        .spyOn(DefaultApi.prototype, 'executeWorkflow')
        .mockRejectedValueOnce(notFoundError);

      // When
      const promise = orchestratorClient.executeWorkflow(args);

      // Then
      await expect(promise).rejects.toThrow();
    });
  });
  describe('abortWorkflow', () => {
    it('should abort a workflow instance successfully', async () => {
      // Given
      const instanceId = 'instance123';
      const mockAbortResponse: string = 'success';
      mockDefaultApi = jest
        .spyOn(DefaultApi.prototype, 'abortWorkflow')
        .mockImplementationOnce(() => {
          const mockResponse: AxiosResponse<string> = {
            data: mockAbortResponse,
            status: 200, // Set status code (optional)
            statusText: 'OK', // Set status text (optional)
            headers: {} as AxiosHeaders,
            config: {} as InternalAxiosRequestConfig,
          };
          return Promise.resolve(mockResponse);
        });

      // When
      const result = await orchestratorClient.abortWorkflowInstance(instanceId);

      // Assert
      expect(result.data).toEqual(mockAbortResponse);
      expect(mockDefaultApi).toHaveBeenCalledTimes(1);
      expect(mockDefaultApi).toHaveBeenCalledWith(
        instanceId,
        getDefaultTestRequestConfig,
      );
    });

    it('should throw a ResponseError if aborting the workflow instance fails', async () => {
      // Given
      const instanceId = 'instance123';
      const notFoundError = new AxiosError('Not Found', '404');
      mockDefaultApi = jest
        .spyOn(DefaultApi.prototype, 'abortWorkflow')
        .mockRejectedValueOnce(notFoundError);

      // When
      const promise = orchestratorClient.abortWorkflowInstance(instanceId);

      // Then
      await expect(promise).rejects.toThrow();
    });
  });
  // describe('getWorkflowDefinition', () => {
  //   it('should return a workflow definition when successful', async () => {
  //     // Given
  //     const workflowId = 'workflow123';
  //     const mockWorkflowDefinition = { id: workflowId, name: 'Workflow 1' };

  //     // Mock fetch to simulate a successful response
  //     (global.fetch as jest.Mock).mockResolvedValueOnce({
  //       ok: true,
  //       json: jest.fn().mockResolvedValue(mockWorkflowDefinition),
  //     });

  //     // When
  //     const result = await orchestratorClient.getWorkflowDefinition(workflowId);

  //     // Then
  //     expect(fetch).toHaveBeenCalledWith(`${baseUrl}/workflows/${workflowId}`, {
  //       headers: defaultAuthHeaders,
  //     });
  //     expect(result).toEqual(mockWorkflowDefinition);
  //   });

  //   it('should throw a ResponseError when fetching the workflow definition fails', async () => {
  //     // Given
  //     const workflowId = 'workflow123';

  //     // Mock fetch to simulate a failed response
  //     (global.fetch as jest.Mock).mockResolvedValueOnce({
  //       ok: false,
  //       status: 404,
  //       statusText: 'Not Found',
  //     });

  //     // When
  //     const promise = orchestratorClient.getWorkflowDefinition(workflowId);

  //     // Then
  //     await expect(promise).rejects.toThrow();
  //   });
  // });
  describe('getWorkflowSource', () => {
    it('should return workflow source when successful', async () => {
      // Given
      const workflowId = 'workflow123';
      const mockWorkflowSource = 'test workflow source';

      mockDefaultApi = jest
        .spyOn(DefaultApi.prototype, 'getWorkflowSourceById')
        .mockImplementationOnce(() => {
          const mockResponse: AxiosResponse<string> = {
            data: mockWorkflowSource,
            status: 200, // Set status code (optional)
            statusText: 'OK', // Set status text (optional)
            headers: {} as AxiosHeaders,
            config: {} as InternalAxiosRequestConfig,
          };
          return Promise.resolve(mockResponse);
        });

      // When
      const result = await orchestratorClient.getWorkflowSource(workflowId);

      // Then
      expect(mockDefaultApi).toHaveBeenCalledTimes(1);
      expect(mockDefaultApi).toHaveBeenCalledWith(
        workflowId,
        getDefaultTestRequestConfig,
      );
      expect(result.data).toEqual(mockWorkflowSource);
    });

    it('should throw a ResponseError when fetching the workflow source fails', async () => {
      // Given
      const workflowId = 'workflow123';
      const notFoundError = new AxiosError('Not Found', '404');
      mockDefaultApi = jest
        .spyOn(DefaultApi.prototype, 'getWorkflowSourceById')
        .mockRejectedValueOnce(notFoundError);

      // When
      const promise = orchestratorClient.getWorkflowSource(workflowId);

      // Then
      await expect(promise).rejects.toThrow(notFoundError.message);
    });
  });
  describe('listInstances', () => {
    it('should return instances when successful', async () => {
      // Given
      const mockInstances: ProcessInstanceListResultDTO = {
        items: [{ id: 'instance123', name: 'Instance 1' }],
        paginationInfo: {},
      };

      mockDefaultApi = jest
        .spyOn(DefaultApi.prototype, 'getInstances')
        .mockImplementationOnce(() => {
          const mockResponse: AxiosResponse<ProcessInstanceListResultDTO> = {
            data: mockInstances,
            status: 200, // Set status code (optional)
            statusText: 'OK', // Set status text (optional)
            headers: {} as AxiosHeaders,
            config: {} as InternalAxiosRequestConfig,
          };
          return Promise.resolve(mockResponse);
        });

      // When
      const result = await orchestratorClient.listInstances();

      // Then
      expect(mockDefaultApi).toHaveBeenCalledTimes(1);
      expect(mockDefaultApi).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        undefined,
        getDefaultTestRequestConfig,
      );
      expect(result.data).toEqual(mockInstances);
    });

    it('should throw a ResponseError when listing instances fails', async () => {
      // Given
      const notFoundError = new AxiosError('Not Found', '404');
      mockDefaultApi = jest
        .spyOn(DefaultApi.prototype, 'getInstances')
        .mockRejectedValueOnce(notFoundError);
      // When
      const promise = orchestratorClient.listInstances();

      // Then
      await expect(promise).rejects.toThrow(notFoundError);
    });
  });
  describe('getInstance', () => {
    it('should return instance when successful', async () => {
      // Given
      const instanceId = 'instance123';
      const includeAssessment = false;
      const mockInstance: AssessedProcessInstanceDTO = {
        instance: { id: instanceId, name: 'Instance 1' },
      };

      mockDefaultApi = jest
        .spyOn(DefaultApi.prototype, 'getInstanceById')
        .mockImplementationOnce(() => {
          const mockResponse: AxiosResponse<AssessedProcessInstanceDTO> = {
            data: mockInstance,
            status: 200, // Set status code (optional)
            statusText: 'OK', // Set status text (optional)
            headers: {} as AxiosHeaders,
            config: {} as InternalAxiosRequestConfig,
          };
          return Promise.resolve(mockResponse);
        });

      // When
      const result = await orchestratorClient.getInstance(
        instanceId,
        includeAssessment,
      );

      // Then
      expect(result.data).toEqual(mockInstance);
      expect(mockDefaultApi).toHaveBeenCalledTimes(1);
      expect(mockDefaultApi).toHaveBeenCalledWith(
        instanceId,
        includeAssessment,
        getDefaultTestRequestConfig,
      );
    });

    it('should throw a ResponseError when fetching the instance fails', async () => {
      // Given
      const instanceId = 'instance123';

      const notFoundError = new AxiosError('Not Found', '404');
      mockDefaultApi = jest
        .spyOn(DefaultApi.prototype, 'getInstanceById')
        .mockRejectedValueOnce(notFoundError);

      // When
      const promise = orchestratorClient.getInstance(instanceId);

      // Then
      await expect(promise).rejects.toThrow(notFoundError);
    });
  });
  // describe('getWorkflowDataInputSchema', () => {
  //   it('should return workflow input schema when successful', async () => {
  //     // Given
  //     const workflowId = 'workflow123';
  //     const instanceId = 'instance123';
  //     const assessmentInstanceId = 'assessment123';
  //     const mockInputSchema = { id: 'schemaId', name: 'schemaName' };

  //     // Mock fetch to simulate a successful response
  //     (global.fetch as jest.Mock).mockResolvedValueOnce({
  //       ok: true,
  //       json: jest.fn().mockResolvedValue(mockInputSchema),
  //     });

  //     // When
  //     const result = await orchestratorClient.getWorkflowDataInputSchema({
  //       workflowId,
  //       instanceId,
  //       assessmentInstanceId,
  //     });

  //     // Then
  //     const expectedEndpoint = `${baseUrl}/workflows/${workflowId}/inputSchema?instanceId=${instanceId}&assessmentInstanceId=${assessmentInstanceId}`;

  //     expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
  //       headers: defaultAuthHeaders,
  //     });
  //     expect(result).toEqual(mockInputSchema);
  //   });

  //   it('should throw a ResponseError when fetching the workflow input schema fails', async () => {
  //     // Given
  //     const workflowId = 'workflow123';

  //     // Mock fetch to simulate a failed response
  //     (global.fetch as jest.Mock).mockResolvedValueOnce({
  //       ok: false,
  //       status: 500,
  //       statusText: 'Internal Server Error',
  //     });

  //     // When
  //     const promise = orchestratorClient.getWorkflowDataInputSchema({
  //       workflowId,
  //     });

  //     // Then
  //     await expect(promise).rejects.toThrow();
  //   });
  // });
  describe('getWorkflowOverview', () => {
    it('should return workflow overview when successful', async () => {
      // Given
      const workflowId = 'workflow123';
      const mockOverview = { id: workflowId, name: 'Workflow 1' };
      const mockResponse: AxiosResponse<WorkflowOverviewDTO> = {
        data: mockOverview,
        status: 200, // Set status code (optional)
        statusText: 'OK', // Set status text (optional)
        headers: {} as AxiosHeaders,
        config: {} as InternalAxiosRequestConfig,
      };
      mockDefaultApi = jest
        .spyOn(DefaultApi.prototype, 'getWorkflowOverviewById')

        .mockImplementationOnce(() => {
          return Promise.resolve(mockResponse);
        });

      // When
      const result = await orchestratorClient.getWorkflowOverview(workflowId);

      // Then
      expect(mockDefaultApi).toHaveBeenCalledTimes(1);
      expect(mockDefaultApi).toHaveBeenCalledWith(
        workflowId,
        getDefaultTestRequestConfig,
      );
      expect(result.data).toEqual(mockOverview);
    });

    it('should throw a ResponseError when fetching the workflow overview fails', async () => {
      // Given
      const workflowId = 'workflow123';

      mockDefaultApi = jest
        .spyOn(DefaultApi.prototype, 'getWorkflowOverviewById')
        .mockImplementationOnce(() => {
          const mockResponse = new AxiosError('Not found', '404');
          return Promise.reject(mockResponse);
        });

      // When
      const promise = orchestratorClient.getWorkflowOverview(workflowId);

      // Then
      await expect(promise).rejects.toThrow();
    });
  });
  describe('retriggerInstanceInError', () => {
    it('should retrigger instance when successful', async () => {
      // Given
      const instanceId = 'instance123';
      const executionId = 'execution123';
      const inputData = { key: 'value' };
      const mockExecutionResponse: ExecuteWorkflowResponseDTO = {
        id: executionId,
      };

      const mockResponse: AxiosResponse<ExecuteWorkflowResponseDTO> = {
        data: mockExecutionResponse,
        status: 200, // Set status code (optional)
        statusText: 'OK', // Set status text (optional)
        headers: {} as AxiosHeaders,
        config: {} as InternalAxiosRequestConfig,
      };
      mockDefaultApi = jest
        .spyOn(DefaultApi.prototype, 'retriggerInstanceById')

        .mockImplementationOnce(() => {
          return Promise.resolve(mockResponse);
        });

      // When
      const result = await orchestratorClient.retriggerInstanceInError({
        instanceId,
        inputData,
      });

      // Then
      expect(result).toBeDefined();
      expect(result.data.id).toBeDefined();
      expect(result.data.id).toEqual(executionId);
      expect(mockDefaultApi).toHaveBeenCalledTimes(1);
      expect(mockDefaultApi).toHaveBeenCalledWith(
        instanceId,
        inputData,
        getDefaultTestRequestConfigWithJSON,
      );
    });

    it('should throw a ResponseError when retriggering instance fails', async () => {
      // Given
      const instanceId = 'instance123';
      const inputData = { key: 'value' };

      mockDefaultApi = jest
        .spyOn(DefaultApi.prototype, 'retriggerInstanceById')
        .mockImplementationOnce(() => {
          const mockResponse = new AxiosError('Not found', '404');
          return Promise.reject(mockResponse);
        });

      // When
      const promise = orchestratorClient.retriggerInstanceInError({
        instanceId,
        inputData,
      });

      // Then
      await expect(promise).rejects.toThrow();
    });
  });
});
