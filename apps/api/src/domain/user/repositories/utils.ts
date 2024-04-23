import { BadRequestException } from '@nestjs/common';
import { PATHS } from './user.repository';

export function urlWrapper(url: string) {
  if (url.includes(PATHS.FOLLOWERS)) {
    const followersIndex = url.indexOf(PATHS.FOLLOWERS);
    return url.slice(followersIndex);
  } else {
    return PATHS.FOLLOWINGS;
  }
}
