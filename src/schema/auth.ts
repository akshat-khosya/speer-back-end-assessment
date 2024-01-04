import { object, string } from 'yup';

const createUserSchema = object({
  body: object({
    name: string().required('Name is Required'),
    email: string().email('Invalid email format').required('Email is Required'),
    password: string().required('Password is Required'),
  }),
  headers: object({
    'content-type': string().required('Content Type is Required').equals(['application/json'], 'Content Type must be application/json'),
  }),
});

const loginUserSchema = object({
  body: object({
    email: string().email('Invalid email format').required('Email is Required'),
    password: string().required('Password is Required'),
  }),
  headers: object({
    'content-type': string().required('Content Type is Required').equals(['application/json'], 'Content Type must be application/json'),
  }),
});

export { createUserSchema, loginUserSchema };
