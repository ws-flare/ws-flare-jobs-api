import { DefaultCrudRepository } from '@loopback/repository';
import { Socket } from '../models';
import { MysqlDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class SocketRepository extends DefaultCrudRepository<Socket,
    typeof Socket.prototype.id> {
    constructor(
        @inject('datasources.mysql') dataSource: MysqlDataSource,
    ) {
        super(Socket, dataSource);
    }
}
