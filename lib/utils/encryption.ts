/**
 * Giải mã dữ liệu được mã hóa bằng AES-GCM từ backend
 * Backend sử dụng: AES-GCM với nonce 12 bytes + ciphertext
 */

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || '';

/**
 * Giải mã một giá trị đơn lẻ
 */
export async function decryptValue(encryptedBase64: string): Promise<unknown> {
  try {
    if (!SECRET_KEY) {
      throw new Error('NEXT_PUBLIC_ENCRYPTION_KEY is not set in environment variables');
    }

    // 1. Decode base64
    const encrypted = Uint8Array.from(atob(encryptedBase64), (c) =>
      c.charCodeAt(0)
    );

    // 2. Tách nonce (12 bytes đầu) và ciphertext (phần còn lại)
    const nonce = encrypted.slice(0, 12);
    const ciphertext = encrypted.slice(12);

    // 3. Hash SECRET_KEY bằng SHA-256
    const keyData = new TextEncoder().encode(SECRET_KEY);
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyData);

    // 4. Import key vào Web Crypto API
    const key = await crypto.subtle.importKey(
      'raw',
      hashBuffer,
      'AES-GCM',
      false,
      ['decrypt']
    );

    // 5. Giải mã bằng AES-GCM
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: nonce,
      },
      key,
      ciphertext
    );

    // 6. Decode và parse
    const plaintext = new TextDecoder().decode(decrypted);

    // Thử parse JSON, nếu không được thì trả về string
    try {
      return JSON.parse(plaintext);
    } catch {
      return plaintext;
    }
  } catch (error) {
    throw new Error(`Failed to decrypt data: ${error}`);
  }
}

/**
 * Giải mã toàn bộ response object
 * Giữ nguyên keys, chỉ giải mã values
 */
export async function decryptResponse(
  response: Record<string, unknown>,
  excludeKeys: string[] = ['message', 'encrypted']
): Promise<Record<string, unknown>> {
  if (!response || typeof response !== 'object') {
    return response;
  }

  const decrypted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(response)) {
    // Bỏ qua các keys không cần giải mã
    if (excludeKeys.includes(key)) {
      decrypted[key] = value;
      continue;
    }

    // Nếu value là string và có vẻ là encrypted (base64)
    if (typeof value === 'string' && value.length > 0) {
      // Kiểm tra xem có phải base64 encrypted value không
      const looksLikeEncrypted = value.length > 20 && /^[A-Za-z0-9+/=]+$/.test(value);

      if (looksLikeEncrypted) {
        try {
          decrypted[key] = await decryptValue(value);
        } catch {
          // Nếu không giải mã được, giữ nguyên
          decrypted[key] = value;
        }
      } else {
        decrypted[key] = value;
      }
    }
    // Nếu value là object, đệ quy giải mã
    else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const nestedDecrypted: Record<string, unknown> = {};
      for (const [nestedKey, nestedValue] of Object.entries(value as Record<string, unknown>)) {
        if (typeof nestedValue === 'string' && nestedValue.length > 20 && /^[A-Za-z0-9+/=]+$/.test(nestedValue)) {
          try {
            nestedDecrypted[nestedKey] = await decryptValue(nestedValue);
          } catch {
            nestedDecrypted[nestedKey] = nestedValue;
          }
        } else if (typeof nestedValue === 'object' && nestedValue !== null) {
          nestedDecrypted[nestedKey] = await decryptResponse(nestedValue as Record<string, unknown>, excludeKeys);
        } else {
          nestedDecrypted[nestedKey] = nestedValue;
        }
      }
      decrypted[key] = nestedDecrypted;
    }
    // Array
    else if (Array.isArray(value)) {
      decrypted[key] = await Promise.all(
        value.map(async (item: unknown) => {
          if (typeof item === 'string' && item.length > 20 && /^[A-Za-z0-9+/=]+$/.test(item)) {
            try {
              return await decryptValue(item);
            } catch {
              return item;
            }
          } else if (typeof item === 'object' && item !== null) {
            return await decryptResponse(item as Record<string, unknown>, excludeKeys);
          }
          return item;
        })
      );
    }
    // Các giá trị khác giữ nguyên
    else {
      decrypted[key] = value;
    }
  }

  return decrypted;
}

/**
 * Kiểm tra xem có cần giải mã không
 */
export function isEncrypted(response: Record<string, unknown>): boolean {
  return response && typeof response === 'object' && response.encrypted === true;
}
