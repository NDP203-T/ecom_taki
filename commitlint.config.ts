import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Tính năng mới
        'fix',      // Sửa lỗi
        'docs',     // Thay đổi tài liệu
        'style',    // Thay đổi không ảnh hưởng code (format, semicolon...)
        'refactor', // Refactor code
        'perf',     // Cải thiện performance
        'test',     // Thêm test
        'build',    // Thay đổi build system
        'ci',       // Thay đổi CI
        'chore',    // Thay đổi khác
        'revert',   // Revert commit trước
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};

export default Configuration;
