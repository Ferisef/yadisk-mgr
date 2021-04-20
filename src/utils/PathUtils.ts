/* eslint-disable no-underscore-dangle */

import StringExtensions from './StringUtils';

class PathUtils {
  private static _separator: string = '/';

  public static get separator() {
    return PathUtils._separator;
  }

  public static set separator(value: string) {
    if (!['/', '\\'].includes(value)) {
      throw new Error("Separator must be '/' or '\\'.");
    }

    PathUtils._separator = value;
  }

  public static combine(...pathParts: string[]) {
    return pathParts.reduce((path: string, pathPart: string, index, srcArray: string[]) => {
      if (typeof pathPart === 'undefined') {
        return path;
      }

      const safePathPart = StringExtensions.removeTrailingChar(pathPart, PathUtils._separator);

      if (path === PathUtils._separator) {
        return StringExtensions.addLeadingChar(safePathPart, PathUtils._separator);
      }

      if (safePathPart.startsWith('.') && index === srcArray.length - 1) {
        return `${path}${safePathPart}`;
      }

      return `${path}${StringExtensions.addLeadingChar(safePathPart, PathUtils._separator)}`;
    });
  }

  public static split(path: string) {
    return StringExtensions.removeLeadingChar(path, PathUtils._separator).split(
      PathUtils._separator,
    );
  }
}

export default PathUtils;
