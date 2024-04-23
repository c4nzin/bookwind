import { BadRequestException } from '@nestjs/common';
import { PATHS } from './user.repository';
/**
 * Wraps the URL based on certain conditions.
 * @param url The URL to be wrapped.
 * @returns Wrapped URL based on conditions.
 */
export function urlWrapper(url: string): string {
  if (url.includes(PATHS.FOLLOWERS)) {
    const followersIndex = url.indexOf(PATHS.FOLLOWERS);
    return url.slice(followersIndex);
  } else {
    return PATHS.FOLLOWINGS;
  }
}
