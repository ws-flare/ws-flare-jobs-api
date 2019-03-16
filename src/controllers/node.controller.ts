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
import {Node} from '../models';
import {NodeRepository} from '../repositories';

export class NodeController {
  constructor(
    @repository(NodeRepository)
    public nodeRepository : NodeRepository,
  ) {}

  @post('/nodes', {
    responses: {
      '200': {
        description: 'Node model instance',
        content: {'application/json': {schema: {'x-ts-type': Node}}},
      },
    },
  })
  async create(@requestBody() node: Node): Promise<Node> {
    return await this.nodeRepository.create(node);
  }

  @get('/nodes/count', {
    responses: {
      '200': {
        description: 'Node model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Node)) where?: Where,
  ): Promise<Count> {
    return await this.nodeRepository.count(where);
  }

  @get('/nodes', {
    responses: {
      '200': {
        description: 'Array of Node model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Node}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Node)) filter?: Filter,
  ): Promise<Node[]> {
    return await this.nodeRepository.find(filter);
  }

  @patch('/nodes', {
    responses: {
      '200': {
        description: 'Node PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() node: Node,
    @param.query.object('where', getWhereSchemaFor(Node)) where?: Where,
  ): Promise<Count> {
    return await this.nodeRepository.updateAll(node, where);
  }

  @get('/nodes/{id}', {
    responses: {
      '200': {
        description: 'Node model instance',
        content: {'application/json': {schema: {'x-ts-type': Node}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Node> {
    return await this.nodeRepository.findById(id);
  }

  @patch('/nodes/{id}', {
    responses: {
      '204': {
        description: 'Node PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() node: Node,
  ): Promise<void> {
    await this.nodeRepository.updateById(id, node);
  }

  @put('/nodes/{id}', {
    responses: {
      '204': {
        description: 'Node PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() node: Node,
  ): Promise<void> {
    await this.nodeRepository.replaceById(id, node);
  }

  @del('/nodes/{id}', {
    responses: {
      '204': {
        description: 'Node DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.nodeRepository.deleteById(id);
  }
}
