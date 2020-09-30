import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import HackneyToken from '../../interfaces/hackneyToken';

const tokenName = 'hackneyToken';

const getFullName = (): string | undefined => {
  const token = Cookies.get(tokenName);
  if (!token) return undefined;

  const decoded = jwt.decode(token);
  if (!decoded) return undefined;
  return (decoded as HackneyToken).name;
};

export default getFullName;
