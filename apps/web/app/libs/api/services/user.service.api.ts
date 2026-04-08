import { api } from "@web/libs/api/axios";
import { BooleanResponse, ResponseSuccess } from "@repo/common/common.type";
import { UpdateUserProfile } from "@repo/common/entity/user.entity.type";

const USER_API_VERSION = "v1";
const USER_PREFIX = "user";

export const updateProfile = async (
  data: UpdateUserProfile,
): Promise<undefined> => {
  await api.patch<BooleanResponse>(`${USER_API_VERSION}/${USER_PREFIX}`, data);
};

export const emailVerification = async () => {
  await api.post<ResponseSuccess<undefined>>(
    `${USER_API_VERSION}/${USER_PREFIX}/email-verification`,
  );
};

export const verifiedEmail = async (token: string) => {
  await api.put<ResponseSuccess<undefined>>(
    `${USER_API_VERSION}/${USER_PREFIX}/email-verification`,
    {
      token,
    },
  );
};
