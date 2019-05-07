/**
 * Remove last slash if exists.
 * @param {?string} input
 * @return {string}
 */
export function removeListSingleSlash (input?: string) {
  if (!input) {
    return '';
  }

  if (input.slice(-1) === '/') {
    return input.slice(0, input.length - 1);
  }

  return input;
}
