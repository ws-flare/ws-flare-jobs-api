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

    constructor(data?: Partial<Node>) {
        super(data);
    }
}
