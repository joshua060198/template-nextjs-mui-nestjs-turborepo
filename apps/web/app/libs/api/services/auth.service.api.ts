import {
  ChangePassword,
  ChangeUserRole,
  ChangeUserRoleResponse,
  GrantOrRevokeUserPermission,
  GrantOrRevokeUserPermissionResponse,
  Login,
  LoginResponse,
  MeResponseFrontend,
  QueryResponsePermission,
  QueryResponseRole,
  QueryResponseUser,
  RegisterUser,
  ResetPasswordResponse,
} from "@repo/common/auth.service.type";
import {
  BooleanResponse,
  ResponseSuccess,
  StringResponse,
} from "@repo/common/common.type";
import {
  CreateRole,
  RoleId,
  UpdateRole,
  UpdateRoleResponse,
} from "@repo/common/entity/role.entity.type";
import { UserId } from "@repo/common/entity/user.entity.type";
import { api, publicApi } from "@web/libs/api/axios";
import { QueryParamsType } from "@web/libs/table/useQueryParamParser";

import qs from "qs";

const AUTH_API_VERSION = "v1";
const AUTH_PREFIX = "auth";

// =============== LOGIN =============== //
export const login = async (payload: Login): Promise<LoginResponse> => {
  const res = await api.post<ResponseSuccess<LoginResponse>>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/login`,
    payload,
  );

  return res.data.data;
};

// =============== LOGOUT =============== //
export const logout = async () => {
  await publicApi.post(`${AUTH_API_VERSION}/${AUTH_PREFIX}/logout`);
};

export const getMe = async (): Promise<MeResponseFrontend> => {
  const res = await api.get<ResponseSuccess<MeResponseFrontend>>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/me`,
  );

  return res.data.data;
};

export const queryUser = async (params: QueryParamsType) => {
  const res = await api.get<ResponseSuccess<QueryResponseUser>>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/user`,
    {
      params,
      paramsSerializer: {
        serialize: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      },
    },
  );
  return res.data.data;
};

export const queryRole = async (params: QueryParamsType) => {
  const res = await api.get<ResponseSuccess<QueryResponseRole>>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/role`,
    {
      params,
      paramsSerializer: {
        serialize: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      },
    },
  );
  return res.data.data;
};

export const queryPermission = async (params: QueryParamsType) => {
  const res = await api.get<ResponseSuccess<QueryResponsePermission>>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/permission`,
    {
      params,
      paramsSerializer: {
        serialize: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      },
    },
  );
  return res.data.data;
};

export const getAvailablePermissions = async () => {
  const res = await api.get<ResponseSuccess<string[]>>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/permission-list`,
  );
  return res.data.data;
};

export const getUserPermissions = async (id: UserId) => {
  const res = await api.get<ResponseSuccess<string[]>>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/user/${id}/permissions`,
  );
  return res.data.data;
};

export const registerUser = async (data: RegisterUser) => {
  const res = await api.post<StringResponse>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/register`,
    data,
  );
  return res.data.data;
};

export const forceResetPassword = async (id: UserId) => {
  const res = await api.post<ResetPasswordResponse>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/user/${id}/reset-password`,
  );
  return res.data.data;
};

export const changePassword = async (data: ChangePassword) => {
  const res = await api.post<BooleanResponse>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/user/change-password`,
    data,
  );
  return res.data.data;
};

export const grantUserPermission = async (
  data: GrantOrRevokeUserPermission,
) => {
  const res = await api.post<GrantOrRevokeUserPermissionResponse>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/user/permission/grant`,
    data,
  );
  return res.data.data;
};

export const revokeUserPermission = async (
  data: GrantOrRevokeUserPermission,
) => {
  const res = await api.post<GrantOrRevokeUserPermissionResponse>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/user/permission/revoke`,
    data,
  );
  return res.data.data;
};

export const changeUserRole = async (data: ChangeUserRole) => {
  const res = await api.post<ChangeUserRoleResponse>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/user/role`,
    data,
  );
  return res.data.data;
};

export const createRole = async (data: CreateRole) => {
  const res = await api.post<UpdateRoleResponse>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/role`,
    data,
  );
  return res.data.data;
};

export const updateRole = async (data: UpdateRole) => {
  const res = await api.put<UpdateRoleResponse>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/role/${data.roleId}`,
    data,
  );
  return res.data.data;
};

export const deleteRole = async (id: RoleId) => {
  const res = await api.post<UpdateRoleResponse>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/role/${id}/delete`,
  );
  return res.data.data;
};

export const restoreRole = async (id: RoleId) => {
  const res = await api.post<UpdateRoleResponse>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/role/${id}/restore`,
  );
  return res.data.data;
};

export const getPermissionActions = async () => {
  const res = await api.get<ResponseSuccess<string[]>>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/permission/actions`,
  );
  return res.data.data;
};

export const getPermissionResources = async () => {
  const res = await api.get<ResponseSuccess<string[]>>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/permission/resources`,
  );
  return res.data.data;
};

export const createPermission = async (data: CreatePermission) => {
  const res = await api.post<CreateUpdatePermissionResponse>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/permission`,
    data,
  );
  return res.data.data;
};

export const updatePermission = async (data: UpdatePermission) => {
  const res = await api.patch<CreateUpdatePermissionResponse>(
    `${AUTH_API_VERSION}/${AUTH_PREFIX}/permission`,
    data,
  );
  return res.data.data;
};
