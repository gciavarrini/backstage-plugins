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
/**
 * 
 * @export
 * @interface ExecuteWorkflowResponseDTO
 */
export interface ExecuteWorkflowResponseDTO {
    /**
     * 
     * @type {string}
     * @memberof ExecuteWorkflowResponseDTO
     */
    id?: string;
}

/**
 * Check if a given object implements the ExecuteWorkflowResponseDTO interface.
 */
export function instanceOfExecuteWorkflowResponseDTO(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ExecuteWorkflowResponseDTOFromJSON(json: any): ExecuteWorkflowResponseDTO {
    return ExecuteWorkflowResponseDTOFromJSONTyped(json, false);
}

export function ExecuteWorkflowResponseDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExecuteWorkflowResponseDTO {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
    };
}

export function ExecuteWorkflowResponseDTOToJSON(value?: ExecuteWorkflowResponseDTO | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
    };
}
