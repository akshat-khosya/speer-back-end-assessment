import { User } from '../model';

const getUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

const createUser = async (email: string, password: string, name: string) => {
  return await User.create({ email, password, name });
};

export { getUserByEmail, createUser };
