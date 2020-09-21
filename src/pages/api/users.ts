import { NextApiRequest, NextApiResponse } from 'next';
import GetUser from '../../usecases/api/getUser';
import GetUsers from '../../usecases/api/getUsers';
import CreateUser from '../../usecases/api/createUser';

interface Data {
  data: any | undefined;
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const emailAddress = req.query.emailAddress
    ? Array.isArray(req.query.emailAddress)
      ? req.query.emailAddress[0]
      : req.query.emailAddress
    : undefined;

  const areaId = req.query.areaId
    ? Array.isArray(req.query.areaId)
      ? req.query.areaId[0]
      : req.query.areaId
    : undefined;

  switch (req.method) {
    case 'GET':
      if (emailAddress !== undefined) {
        const getUser = new GetUser(emailAddress);

        const response = await getUser.execute();

        if (response.error === undefined) {
          res.status(200).json({ data: response.body });
        } else {
          res.status(response.error).end();
        }
        break;
      }

      if (areaId !== undefined) {
        const areaIdInt = parseInt(areaId);
        const allUsers = new GetUsers(areaIdInt);

        const response = await allUsers.execute();

        if (response.error === undefined) {
          res.status(200).json({ data: response.body });
        } else {
          res.status(response.error).end();
        }
        break;
      }

      res.status(400).end();
      break;
    case 'POST':
      const user = {
        emailAddress: req.body.emailAddress,
        fullName: req.body.fullName,
        firstName: req.body.firstName,
        familyName: req.body.familyName,
      };

      const createUser = new CreateUser(user);

      const postResponse = await createUser.execute();
      if (postResponse.error === undefined) {
        res.status(201).json(postResponse.body);

        break;
      }
      res.status(postResponse.error).end();

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
