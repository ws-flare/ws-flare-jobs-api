import { Entity, model, property } from '@loopback/repository';
import * as uuid from 'uuid/v4';

/**
 * Model which defines the attributes of a Job to be stores in mysql database
 */
@model()
export class Job extends Entity {
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
    userId: string;

    @property({
        type: 'string',
        required: true,
    })
    taskId: string;

    @property({
        type: 'boolean'
    })
    isRunning: boolean;

    @property({
        type: 'boolean'
    })
    passed: boolean;


    constructor(data?: Partial<Job>) {
        super(data);
    }
}
