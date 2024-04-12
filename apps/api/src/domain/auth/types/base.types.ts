import { LoginDto } from '../dto';

export type LoginReturn = {
  message: {
    title: string;
    body: LoginDto;
  };
  statusCode: number;
};

export type LogoutResponse = {
  message: string;
  statusCode: number;
};
