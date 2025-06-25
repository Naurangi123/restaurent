import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from '../constants';

// Decode token to get user_id
export const getUserFromToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.user_id;
  } catch (error) {
    console.error('Invalid or expired token', error);
    return null;
  }
};
