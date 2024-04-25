import { FollowerRoutes } from './user.repository';
/* prettier-ignore */

/**
 * Wraps the URL based on certain conditions.
 * @param url The URL to be wrapped.
 * @returns Wrapped URL based on conditions.
 */
export function extractPathFromUrl(url: string, targetPath: string): string {
  const pathIndex = url.indexOf(targetPath);
  return pathIndex !== -1 ? url.slice(pathIndex) : "";
}

// export function urlWrapper(url: string): string {
//   if (url.includes(PATHS.FOLLOWERS)) {
//     const followersIndex = url.indexOf(PATHS.FOLLOWERS);
//     return url.slice(followersIndex);
//   } else {
//     return PATHS.FOLLOWINGS;
//   }
// }
