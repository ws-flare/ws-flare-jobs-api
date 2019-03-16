import { DefaultCrudRepository } from '@loopback/repository';
import { Node } from '../models';
import { inject } from '@loopback/core';
import { MysqlDataSource } from '../datasources';

export class NodeRepository extends DefaultCrudRepository<Node,
    typeof Node.prototype.id> {
    constructor(
        @inject('datasources.mysql') dataSource: MysqlDataSource,
    ) {
        super(Node, dataSource);
    }
}
