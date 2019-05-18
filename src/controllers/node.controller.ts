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

/**
 * Handles /nodes endpoints
 */
export class NodeController {
  constructor(
    @repository(NodeRepository)
    public nodeRepository : NodeRepository,
  ) {}

  /**
   * Creates a new node
   *
   * @param node - The new node
   */
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

  /**
   * Counts nodes stored in the database
   *
   * @param where - Filter to apply
   */
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

  /**
   * Gets a list of nodes with a given filter
   *
   * @param filter - The filter to apply
   */
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

  /**
   * Updates a node at a given filter
   *
   * @param node - Node to update
   * @param where - The filter to apply
   */
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

  /**
   * Gets a node by id
   *
   * @param id - The node id
   */
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

  /**
   * Updates a node by id
   *
   * @param id - The id
   * @param node - The node to update to
   */
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

  /**
   * Updates a node by id
   *
   * @param id - The node id
   * @param node - The node to update to
   */
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

  /**
   * Deletes a node by id
   *
   * @param id - The node id to delete
   */
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
