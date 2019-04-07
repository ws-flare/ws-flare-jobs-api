import { Entity, model, property } from '@loopback/repository';
import * as uuid from 'uuid/v4';

@model()
export class Socket extends Entity {
    @property({
        type: 'string',
        id: true,
        default: () => uuid()
    })
    id: string;

    @property({
        type: 'string',
        id: true,
        required: true
    })
    jobId: string;

    @property({
        type: 'boolean'
    })
    connected: boolean;

    @property({
        type: 'boolean'
    })
    disconnected: boolean;

    @property({
        type: 'boolean'
    })
    hasError: boolean;

    @property({
        type: 'date'
    })
    connectionTime: string;

    @property({
        type: 'date',
    })
    disconnectTime?: string;

    @property({
        type: 'date'
    })
    errorTime?: string;

    @property({
        type: 'number',
    })
    timeToConnection?: number;

    constructor(data?: Partial<Socket>) {
        super(data);
    }
}
