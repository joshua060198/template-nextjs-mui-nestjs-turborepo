import { ErrorCode } from './common.type.js';

class FileError extends ErrorCode {
  private static SERVICE_CODE = '02';

  constructor(errorCode: string, message?: string) {
    super(FileError.SERVICE_CODE, errorCode, message);
  }
}

export const FILE_UPLOAD_ERROR = {
  UPLOADED_FILE_NOT_FOUND: new FileError(
    '01',
    "Can't get the new created file. Please check prepareUpload() function in file-upload.service.js.",
  ),
  USER_NOT_FOUND: new FileError('02', 'User not found. Please check again.'),
  EXCEED_QUOTA_ERROR: new FileError(
    '03',
    'Newly file upload exceeded user quota.',
  ),
  FILE_INVALID_ACCESS: new FileError(
    '04',
    "This user don't have permission to view this file.",
  ),
  DIFFERENT_FILE_UPLOADED: new FileError(
    '05',
    'The file is different from the last prepare upload call.',
  ),
};
