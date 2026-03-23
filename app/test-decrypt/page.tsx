'use client';

import { useState } from 'react';
import { decryptValue } from '@/lib/utils/encryption';

export default function TestDecryptPage() {
  const [encryptedValue, setEncryptedValue] = useState('');
  const [decryptedValue, setDecryptedValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || '';

  const handleDecrypt = async () => {
    setError(null);
    setDecryptedValue(null);

    try {
      const result = await decryptValue(encryptedValue);
      setDecryptedValue(JSON.stringify(result, null, 2));
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test Decryption</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>
          <strong>SECRET_KEY:</strong>
          <br />
          <input
            type="text"
            value={secretKey}
            readOnly
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '8px',
              fontFamily: 'monospace',
              backgroundColor: '#f5f5f5',
            }}
          />
        </label>
        <p style={{ fontSize: '12px', color: '#666' }}>
          From NEXT_PUBLIC_ENCRYPTION_KEY env variable
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          <strong>Encrypted Value (Base64):</strong>
          <br />
          <textarea
            value={encryptedValue}
            onChange={(e) => setEncryptedValue(e.target.value)}
            placeholder="Paste encrypted value here..."
            rows={5}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '8px',
              fontFamily: 'monospace',
            }}
          />
        </label>
      </div>

      <button
        onClick={handleDecrypt}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0071e3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Decrypt
      </button>

      {error && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#fee',
            color: '#c00',
            borderRadius: '8px',
          }}
        >
          <strong>Error:</strong>
          <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
            {error}
          </pre>
        </div>
      )}

      {decryptedValue && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            borderRadius: '8px',
          }}
        >
          <strong>Decrypted Value:</strong>
          <pre
            style={{
              marginTop: '8px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {decryptedValue}
          </pre>
        </div>
      )}

      <div
        style={{
          marginTop: '40px',
          padding: '16px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <h3>Instructions:</h3>
        <ol>
          <li>Make sure NEXT_PUBLIC_ENCRYPTION_KEY is set in .env.local</li>
          <li>Paste an encrypted value from backend response</li>
          <li>Click Decrypt to test</li>
          <li>Check browser console for detailed logs</li>
        </ol>
      </div>
    </div>
  );
}
