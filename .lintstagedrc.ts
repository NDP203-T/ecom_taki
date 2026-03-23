const config = {
  // Kiểm tra TypeScript syntax
  '**/*.{ts,tsx}': [
    () => 'tsc --noEmit --skipLibCheck',
    'eslint --fix',
  ],
  // Kiểm tra JavaScript syntax
  '**/*.{js,jsx}': [
    'eslint --fix',
  ],
  // Format các file khác
  '**/*.{json,md,css}': [
    'prettier --write',
  ],
};

export default config;
