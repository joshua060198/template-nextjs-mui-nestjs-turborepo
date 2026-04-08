import { ErrorCode } from './common.type.js';

class UserError extends ErrorCode {
  private static SERVICE_CODE = '03';

  constructor(errorCode: string, message?: string) {
    super(UserError.SERVICE_CODE, errorCode, message);
  }
}

export const USER_ERROR = {
  USER_NOT_FOUND: new UserError('001', 'User not found!'),
  FAILED_TO_UPDATE_USER: new UserError(
    '002',
    'Failed to execute update profile! Please check again.',
  ),
  EMAIL_IS_EMPTY: new UserError(
    '003',
    'User email is empty, but requesting email verification!',
  ),
  EMAIL_ALREADY_VERIFIED: new UserError(
    '004',
    'Email already verified, but requesting email verification!',
  ),
  EMAIL_VERIFICATION_TOO_SOON: new UserError(
    '005',
    'User must wait 5 minutes to send another email verification!',
  ),
  FAILED_SENDING_EMAIL_VERIFICATION: new UserError(
    '006',
    'Failed to send verification email. Please check email manager.',
  ),
  FAILED_SAVE_VERIFICATION_DATA: new UserError(
    '007',
    'Failed to save user verification data!',
  ),
  INVALID_EMAIL_VERIFICATION_TOKEN: new UserError(
    '008',
    "Invalid email verification token! Can't find user with that verification token.",
  ),
  VERIFICATION_TOKEN_EXPIRED: new UserError(
    '009',
    'Verification token has been expired!',
  ),
};
