import { Entity, model, property } from '@loopback/repository';
import * as uuid from 'uuid/v4';

@model()
export class Node extends Entity {
    @property({
        type: 'string',
        id: true,
        default: () => uuid()
    })
    id?: string;

    @property({
        type: 'date',
        default: () => new Date()
    })
    createdAt: string;

    @property({
        type: 'string',
        required: true,
    })
    jobId: string;

    @property({
        type: 'string',
        required: true,
    })
    name: string;

    @property({
        type: 'boolean',
        required: true,
    })
    running: boolean;

    @property({
        type: 'number',
        required: false,
        default: 0
    })
    totalSuccessfulConnections: number;

    @property({
        type: 'number',
        required: false,
        default: 0
    })
    totalFailedConnections: number;

    @property({
        type: 'number',
        required: false,
        default: 0
    })
    totalDroppedConnections: number;

    constructor(data?: Partial<Node>) {
        super(data);
    }
}
