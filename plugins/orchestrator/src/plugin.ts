import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  defaultApiRef,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

import { orchestratorApiRef, OrchestratorClient } from './api';
import { orchestratorRootRouteRef } from './routes';

export const orchestratorPlugin = createPlugin({
  id: 'orchestrator',
  apis: [
    createApiFactory({
      api: orchestratorApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef,
        defaultApi: defaultApiRef,
      },
      factory({ discoveryApi, identityApi, defaultApi }) {
        return new OrchestratorClient({
          discoveryApi,
          identityApi,
          defaultApi,
        });
      },
    }),
  ],
  routes: {
    root: orchestratorRootRouteRef,
  },
});

export const OrchestratorPage = orchestratorPlugin.provide(
  createRoutableExtension({
    name: 'OrchestratorPage',
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: orchestratorRootRouteRef,
  }),
);
