import Crypto, { BinaryLike } from 'crypto';

class HashUtils {
  public static createHash(data: BinaryLike) {
    return Crypto.createHash('sha1').update(data).digest('hex');
  }
}

export default HashUtils;
