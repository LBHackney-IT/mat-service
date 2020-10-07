import { NextApiRequest, NextApiResponse } from 'next';
import { isError, isSuccess } from '../../lib/utils';
import { getOfficerPatch } from '../../usecases/api';
import { getOfficersPerArea, getUser } from '../../usecases/api';

interface Data {
  users?: any;
  error?: string;
}

const doGet = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> => {
  const emailAddress = req.query.emailAddress
    ? Array.isArray(req.query.emailAddress)
      ? req.query.emailAddress[0]
      : req.query.emailAddress
    : undefined;

  const managerEmail = req.query.managerEmail
    ? Array.isArray(req.query.managerEmail)
      ? req.query.managerEmail[0]
      : req.query.managerEmail
    : undefined;

  if (emailAddress !== undefined) {
    const response = await getUser.execute(emailAddress);

    if (response.error === undefined) {
      res.status(200).json({ users: response.body });
    } else {
      res.status(response.error).end();
    }
    return;
  }

  if (managerEmail !== undefined) {
    const officerPatch = await getOfficerPatch.execute(managerEmail);
    if (isError(officerPatch) || !officerPatch.areaId) {
      return res.status(500).json({ error: 'Error fetching officer patch id' });
    }

    const response = await getOfficersPerArea.execute(officerPatch.areaId);

    if (isSuccess(response)) {
      return res.status(200).json({ users: response });
    } else {
      return res.status(500).end();
    }
  }

  res.status(400).end();
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> => {
  if (req.method === 'GET') {
    await doGet(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
