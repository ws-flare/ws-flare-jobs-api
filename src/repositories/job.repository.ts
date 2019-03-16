import { DefaultCrudRepository } from '@loopback/repository';
import { Job } from '../models';
import { MysqlDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class JobRepository extends DefaultCrudRepository<Job,
    typeof Job.prototype.id> {
    constructor(
        @inject('datasources.mysql') dataSource: MysqlDataSource,
    ) {
        super(Job, dataSource);
    }
}
