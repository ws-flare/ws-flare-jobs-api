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
import {Job} from '../models';
import {JobRepository} from '../repositories';

/**
 * Controller for handling /jobs endpoints
 */
export class JobController {
  constructor(
    @repository(JobRepository)
    public jobRepository : JobRepository,
  ) {}

  /**
   * Creates a new job
   *
   * @param job - The new job
   */
  @post('/jobs', {
    responses: {
      '200': {
        description: 'Job model instance',
        content: {'application/json': {schema: {'x-ts-type': Job}}},
      },
    },
  })
  async create(@requestBody() job: Job): Promise<Job> {
    return await this.jobRepository.create(job);
  }

  /**
   * Gets a count of jobs stored in the database with a given filter
   *
   * @param where - The filter to apply
   */
  @get('/jobs/count', {
    responses: {
      '200': {
        description: 'Job model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Job)) where?: Where,
  ): Promise<Count> {
    return await this.jobRepository.count(where);
  }

  /**
   * Gets a list of jobs with a given filter
   *
   * @param filter - The filter to apply
   */
  @get('/jobs', {
    responses: {
      '200': {
        description: 'Array of Job model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Job}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Job)) filter?: Filter,
  ): Promise<Job[]> {
    return await this.jobRepository.find(filter);
  }

  /**
   * Updates a job
   *
   * @param job - The job to update
   * @param where - The filter to apply
   */
  @patch('/jobs', {
    responses: {
      '200': {
        description: 'Job PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() job: Job,
    @param.query.object('where', getWhereSchemaFor(Job)) where?: Where,
  ): Promise<Count> {
    return await this.jobRepository.updateAll(job, where);
  }

  /**
   * Gets a single job by id
   *
   * @param id - The id to search for
   */
  @get('/jobs/{id}', {
    responses: {
      '200': {
        description: 'Job model instance',
        content: {'application/json': {schema: {'x-ts-type': Job}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Job> {
    return await this.jobRepository.findById(id);
  }

  /**
   * Updates a job by id
   *
   * @param id - The job id
   * @param job - The job to update
   */
  @patch('/jobs/{id}', {
    responses: {
      '204': {
        description: 'Job PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() job: Job,
  ): Promise<void> {
    await this.jobRepository.updateById(id, job);
  }

  /**
   * Updates a job by id
   *
   * @param id - The job id
   * @param job - The job to update
   */
  @put('/jobs/{id}', {
    responses: {
      '204': {
        description: 'Job PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() job: Job,
  ): Promise<void> {
    await this.jobRepository.replaceById(id, job);
  }

  /**
   * Deletes a job by id
   *
   * @param id - The job id
   */
  @del('/jobs/{id}', {
    responses: {
      '204': {
        description: 'Job DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.jobRepository.deleteById(id);
  }
}
