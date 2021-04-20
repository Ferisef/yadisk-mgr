class StringExtensions {
  public static addLeadingChar(str: string, char: string) {
    return str.startsWith(char) ? str : `${char}${str}`;
  }

  public static removeLeadingChar(str: string, char: string) {
    return str.startsWith(char) ? str.slice(char.length) : str;
  }

  public static addTrailingChar(str: string, char: string) {
    return str.endsWith(char) ? str : `${str}${char}`;
  }

  public static removeTrailingChar(str: string, chr: string) {
    return str.endsWith(chr) ? str.slice(0, str.length - chr.length) : str;
  }
}

export default StringExtensions;
