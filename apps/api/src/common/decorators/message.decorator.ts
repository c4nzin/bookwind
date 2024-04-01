import { Reflector } from '@nestjs/core';

export const MESSAGE_KEY = 'response-message';

export const Message = Reflector.createDecorator<string>({ key: MESSAGE_KEY });
