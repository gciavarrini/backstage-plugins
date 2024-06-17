import moment from 'moment';

import {
  ProcessInstanceDTO,
  ProcessInstanceStatusDTO,
  WorkflowCategory,
  WorkflowCategoryDTO,
} from '@janus-idp/backstage-plugin-orchestrator-common';

import { fakeWorkflowOverviewList } from './fakeWorkflowOverviewList';

let id = 10;
const baseDate = '2023-11-16T10:50:34.346Z';
export const fakeProcessInstance1: ProcessInstanceDTO = {
  id: `12f767c1-9002-43af-9515-62a72d0eaf${id++}`,
  name: fakeWorkflowOverviewList[0].name,
  workflow: fakeWorkflowOverviewList[0].workflowId,
  status: ProcessInstanceStatusDTO.Error,
  start: baseDate,
  end: moment(baseDate).add(13, 'hours').toISOString(),
  category: WorkflowCategoryDTO.Infrastructure,
  description: 'test description 1',
  workflowdata: {
    workflowdata: {
      workflowOptions: {
        'my-category': {
          id: 'next-workflow-1',
          name: 'Next Workflow One',
        },
        'my-secod-category': [
          {
            id: 'next-workflow-20',
            name: 'Next Workflow Twenty',
          },
          {
            id: 'next-workflow-21',
            name: 'Next Workflow Twenty One',
          },
        ],
      },
    },
  },
};

export const fakeCompletedInstance: ProcessInstanceDTO = {
  id: `12f767c1-9002-43af-9515-62a72d0eaf${id++}`,
  name: fakeWorkflowOverviewList[1].name,
  workflow: fakeWorkflowOverviewList[1].workflowId,
  status: ProcessInstanceStatusDTO.Completed,
  start: moment(baseDate).add(1, 'hour').toISOString(),
  end: moment(baseDate).add(1, 'day').toISOString(),
  category: WorkflowCategoryDTO.Assessment,
  description: 'test description 2',
};

export const fakeActiveInstance: ProcessInstanceDTO = {
  id: `12f767c1-9002-43af-9515-62a72d0eaf${id++}`,
  name: fakeWorkflowOverviewList[2].name,
  workflow: fakeWorkflowOverviewList[2].workflowId,
  status: ProcessInstanceStatusDTO.Running,
  start: moment(baseDate).add(2, 'hours').toISOString(),
  category: WorkflowCategoryDTO.Infrastructure,
  description: 'test description 3',
};

export const fakeProcessInstance4: ProcessInstanceDTO = {
  id: `12f767c1-9002-43af-9515-62a72d0eaf${id++}`,
  name: fakeWorkflowOverviewList[3].name,
  workflow: fakeWorkflowOverviewList[3].workflowId,
  status: ProcessInstanceStatusDTO.Suspended,
  start: baseDate,
  category: WorkflowCategoryDTO.Infrastructure,
  description: 'test description 4',
};

export const fakeProcessInstances = [
  fakeProcessInstance1,
  fakeCompletedInstance,
  fakeActiveInstance,
  fakeProcessInstance4,
];
