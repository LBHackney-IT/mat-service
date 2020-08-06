import GetTask from './getTask';

describe('GetTask', () => {
  it('Returns a valid response', () => {
    const id = '5956eb7f-9edb-4e05-8934-8f2ee414cd81';
    const task = {
      id: '5956eb7f-9edb-4e05-8934-8f2ee414cd81',
      createdTime: '2007-03-01T13:00:00Z',
      category: 'Tenancy Audit And Visits',
      type: 'Tenancy & Household Check',
      resident: {
        presentationName: 'Mr John Smith',
        role: 'tenant',
        dateOfBirth: '2007-03-01',
        mobileNumber: '07707188934',
        homePhoneNumber: '0201234567',
        workPhoneNumber: '01301234567',
        email: 'johnDoe@email.com',
      },
      address: {
        presentationShort: 'Flat 9, Made Up Court, 7 Fake Road',
      },
      dueTime: '2007-03-01T13:00:00Z',
      dueState: 'string',
      completedTime: '2007-03-01T13:00:00Z',
      stage: 'string',
      children: [],
      referenceNumber: 'string',
    };
    const getTask = new GetTask(id);
    const response = getTask.execute();

    expect(response).toEqual({ body: task, error: undefined });
  });

  it('Returns an error response when given invalid id', () => {
    const id = '90a0f5a8-0990-4058-860f-d594884ee300';
    const getTask = new GetTask(id);
    const response = getTask.execute();
    expect(response).toEqual({ body: '', error: undefined });
  });
});
