import httpMocks from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import Task from '../../../pages/api/tasks/[id]';
import { any } from 'cypress/types/bluebird';

describe('GetTask API', () => {
  it('Returns an error response if an invalid id is provided', async () => {
    const req = httpMocks.createRequest<NextApiRequest>();
    const res = httpMocks.createResponse<NextApiResponse>();

    res.status = jest.fn(function () {
      return this;
    })

    await Task(req, res);

    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(400)
  });

  it('Returns a valid response if an valid id is provided', async () => {
    const req = httpMocks.createRequest<NextApiRequest>({query: {id: '5956eb7f-9edb-4e05-8934-8f2ee414cd81'}});
    const res = httpMocks.createResponse<NextApiResponse>();

    res.status = jest.fn(function () {
      return this;
    })

    await Task(req, res);

    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)
  });
});
