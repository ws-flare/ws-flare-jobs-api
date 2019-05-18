import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Socket} from '../models';
import {SocketRepository} from '../repositories';

/**
 * Controller for handling /sockets endpoints
 */
export class SocketsController {
  constructor(
    @repository(SocketRepository)
    public socketRepository : SocketRepository,
  ) {}

  /**
   * Creates a new socket
   *
   * @param socket - The socket to create
   */
  @post('/sockets', {
    responses: {
      '200': {
        description: 'Socket model instance',
        content: {'application/json': {schema: {'x-ts-type': Socket}}},
      },
    },
  })
  async create(@requestBody() socket: Socket): Promise<Socket> {
    return await this.socketRepository.create(socket);
  }

  /**
   * Counts sockets stored in the database at a given filter
   *
   * @param where - The filter to apply
   */
  @get('/sockets/count', {
    responses: {
      '200': {
        description: 'Socket model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Socket)) where?: Where,
  ): Promise<Count> {
    return await this.socketRepository.count(where);
  }

  /**
   * Gets a list of sockets with a given filter
   *
   * @param filter - The filter to apply
   */
  @get('/sockets', {
    responses: {
      '200': {
        description: 'Array of Socket model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Socket}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Socket)) filter?: Filter,
  ): Promise<Socket[]> {
    return await this.socketRepository.find(filter);
  }

  /**
   * Updates a socket at a given filter
   *
   * @param socket - The socket to update to
   * @param where - The filter to apply
   */
  @patch('/sockets', {
    responses: {
      '200': {
        description: 'Socket PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() socket: Socket,
    @param.query.object('where', getWhereSchemaFor(Socket)) where?: Where,
  ): Promise<Count> {
    return await this.socketRepository.updateAll(socket, where);
  }

  /**
   * Gets a socket by id
   *
   * @param id - The socket id
   */
  @get('/sockets/{id}', {
    responses: {
      '200': {
        description: 'Socket model instance',
        content: {'application/json': {schema: {'x-ts-type': Socket}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Socket> {
    return await this.socketRepository.findById(id);
  }

  /**
   * Updates a socket by id
   *
   * @param id - The socket id
   * @param socket - The socket to update to
   */
  @patch('/sockets/{id}', {
    responses: {
      '204': {
        description: 'Socket PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() socket: Socket,
  ): Promise<void> {
    await this.socketRepository.updateById(id, socket);
  }

  /**
   * Updates a socket by id
   *
   * @param id - The socket id
   * @param socket - The socket to update to
   */
  @put('/sockets/{id}', {
    responses: {
      '204': {
        description: 'Socket PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() socket: Socket,
  ): Promise<void> {
    await this.socketRepository.replaceById(id, socket);
  }

  /**
   * Deletes a socket by id
   *
   * @param id - The socket id
   */
  @del('/sockets/{id}', {
    responses: {
      '204': {
        description: 'Socket DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.socketRepository.deleteById(id);
  }
}
