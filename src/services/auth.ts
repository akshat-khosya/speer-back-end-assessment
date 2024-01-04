import { User } from '../model';

const getUserByEmail = async (email: string) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};

const createUser = async (email: string, password: string, name: string) => {
  try {
    return await User.create({ email, password, name });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export { getUserByEmail, createUser };
