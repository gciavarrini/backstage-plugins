/* tslint:disable */
/* eslint-disable */
/**
 * Orchestrator plugin
 * API to interact with orchestrator plugin
 *
 * The version of the OpenAPI document: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { ProcessInstanceErrorDTO } from './ProcessInstanceErrorDTO';
import {
    ProcessInstanceErrorDTOFromJSON,
    ProcessInstanceErrorDTOFromJSONTyped,
    ProcessInstanceErrorDTOToJSON,
} from './ProcessInstanceErrorDTO';
import type { ProcessInstanceStatusDTO } from './ProcessInstanceStatusDTO';
import {
    ProcessInstanceStatusDTOFromJSON,
    ProcessInstanceStatusDTOFromJSONTyped,
    ProcessInstanceStatusDTOToJSON,
} from './ProcessInstanceStatusDTO';

/**
 * 
 * @export
 * @interface WorkflowProgressDTO
 */
export interface WorkflowProgressDTO {
    /**
     * Type name
     * @type {any}
     * @memberof WorkflowProgressDTO
     */
    typename?: any | null;
    /**
     * Node instance ID
     * @type {any}
     * @memberof WorkflowProgressDTO
     */
    id?: any | null;
    /**
     * Node name
     * @type {any}
     * @memberof WorkflowProgressDTO
     */
    name?: any | null;
    /**
     * Node type
     * @type {any}
     * @memberof WorkflowProgressDTO
     */
    type?: any | null;
    /**
     * Date when the node was entered
     * @type {any}
     * @memberof WorkflowProgressDTO
     */
    enter?: any | null;
    /**
     * Date when the node was exited (optional)
     * @type {any}
     * @memberof WorkflowProgressDTO
     */
    exit?: any | null;
    /**
     * Definition ID
     * @type {any}
     * @memberof WorkflowProgressDTO
     */
    definitionId?: any | null;
    /**
     * Node ID
     * @type {any}
     * @memberof WorkflowProgressDTO
     */
    nodeId?: any | null;
    /**
     * 
     * @type {ProcessInstanceStatusDTO}
     * @memberof WorkflowProgressDTO
     */
    status?: ProcessInstanceStatusDTO;
    /**
     * 
     * @type {ProcessInstanceErrorDTO}
     * @memberof WorkflowProgressDTO
     */
    error?: ProcessInstanceErrorDTO;
}

/**
 * Check if a given object implements the WorkflowProgressDTO interface.
 */
export function instanceOfWorkflowProgressDTO(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function WorkflowProgressDTOFromJSON(json: any): WorkflowProgressDTO {
    return WorkflowProgressDTOFromJSONTyped(json, false);
}

export function WorkflowProgressDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): WorkflowProgressDTO {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'typename': !exists(json, '__typename') ? undefined : json['__typename'],
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'type': !exists(json, 'type') ? undefined : json['type'],
        'enter': !exists(json, 'enter') ? undefined : json['enter'],
        'exit': !exists(json, 'exit') ? undefined : json['exit'],
        'definitionId': !exists(json, 'definitionId') ? undefined : json['definitionId'],
        'nodeId': !exists(json, 'nodeId') ? undefined : json['nodeId'],
        'status': !exists(json, 'status') ? undefined : ProcessInstanceStatusDTOFromJSON(json['status']),
        'error': !exists(json, 'error') ? undefined : ProcessInstanceErrorDTOFromJSON(json['error']),
    };
}

export function WorkflowProgressDTOToJSON(value?: WorkflowProgressDTO | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        '__typename': value.typename,
        'id': value.id,
        'name': value.name,
        'type': value.type,
        'enter': value.enter,
        'exit': value.exit,
        'definitionId': value.definitionId,
        'nodeId': value.nodeId,
        'status': ProcessInstanceStatusDTOToJSON(value.status),
        'error': ProcessInstanceErrorDTOToJSON(value.error),
    };
}
