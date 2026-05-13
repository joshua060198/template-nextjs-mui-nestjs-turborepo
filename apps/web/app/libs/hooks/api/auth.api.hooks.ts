"use client";
import { MeResponseFrontend } from "@repo/common/auth.service.type";
import { FailedResponse, ResponseFailed } from "@repo/common/common.type";
import { UserId } from "@repo/common/entity/user.entity.type";
import {
  InvalidateQueryFilters,
  Query,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useRouter } from "@web/i18n/navigation";
import {
  changePassword,
  changeUserRole,
  createRole,
  deleteRole,
  forceResetPassword,
  getAvailablePermissions,
  getMe,
  getPermissionActions,
  getPermissionResources,
  getUserPermissions,
  grantUserPermission,
  login,
  logout,
  queryPermission,
  queryRole,
  queryUser,
  registerUser,
  restoreRole,
  revokeUserPermission,
  updateRole,
} from "@web/libs/api/services/auth.service.api";
import use401ErrorHandler from "@web/libs/hooks/api/with401ErrorHandler";
import { useSnack } from "@web/libs/hooks/useSnack.hooks";
import { useSuccessfulLoginRedirect } from "@web/libs/hooks/useSuccessfulLogin.hooks";
import { QueryParamsType } from "@web/libs/table/useQueryParamParser";
import { useTranslations } from "next-intl";
import { startTransition, useEffect } from "react";

function useHandleAuthError() {
  const t = useTranslations("Service.Auth");
  const snack = useSnack();
  return use401ErrorHandler((err: ResponseFailed) => {
    if (err.error.code.startsWith("01")) {
      snack.error(t("Errors." + err.error.code));
    } else {
      snack.error(t("Errors.Other"));
    }
  });
}

function useHandleAuthSuccess(msg?: string, queries?: string[]) {
  const snack = useSnack();
  const queryClient = useQueryClient();
  const t = useTranslations("Service.Auth");
  return () => {
    if (msg) snack.success(t(msg));
    queryClient.invalidateQueries(
      queries as InvalidateQueryFilters<readonly unknown[]>,
    );
  };
}

export function useLogin() {
  const t = useTranslations("Service.Auth");
  const snack = useSnack();
  const redirectAfterLogin = useSuccessfulLoginRedirect();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: () => {
      snack.success(t("Form.LoginSuccess"));
      redirectAfterLogin();
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error: FailedResponse) => {
      if ("details" in error.error) {
        snack.error(t("Errors.FieldError"));
      } else {
        snack.error(t("Errors.CredentialError"));
      }
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSettled: async () => {
      queryClient.clear();
      startTransition(() => {
        router.replace("/login");
      });
    },
  });
}

export function useAuth<
  TSelect extends { resetPassword: boolean } = MeResponseFrontend,
>(
  options?: Omit<
    UseQueryOptions<MeResponseFrontend, Error, TSelect>,
    "queryKey"
  >,
) {
  const router = useRouter();

  const query = useQuery<MeResponseFrontend, Error, TSelect>({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: options?.enabled,
    select: options?.select,
    retry: false,
    staleTime: (query: Query<MeResponseFrontend, Error, MeResponseFrontend>) =>
      query.state.data && query.state.data.imageExpiration
        ? 1000 * (query.state.data.imageExpiration - 60)
        : 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.resetPassword) {
        router.replace("/reset-password");
      }
    }
  }, [query.isSuccess, query.data, router]);

  return query;
}

export function useUserQuery(params: QueryParamsType = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => queryUser(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function useRoleQuery(params: QueryParamsType = {}) {
  return useQuery({
    queryKey: ["roles", params],
    queryFn: () => queryRole(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function usePermissionQuery(params: QueryParamsType = {}) {
  return useQuery({
    queryKey: ["permissions", params],
    queryFn: () => queryPermission(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function useRegisterUser() {
  return useMutation({
    mutationKey: ["register-user"],
    mutationFn: registerUser,
    onSuccess: useHandleAuthSuccess("Form.RegisterSuccess", ["users"]),
    onError: useHandleAuthError(),
  });
}

export function useForceResetPassword() {
  return useMutation({
    mutationKey: ["force-reset-password"],
    mutationFn: forceResetPassword,
    onSuccess: useHandleAuthSuccess("Form.ResetPasswordSuccess", ["users"]),
    onError: useHandleAuthError(),
  });
}

export function useChangePassword() {
  const snack = useSnack();
  const queryClient = useQueryClient();
  const t = useTranslations("Service.Auth");
  const { mutate: logout } = useLogout();
  return useMutation({
    mutationKey: ["change-password"],
    mutationFn: changePassword,
    onSuccess: () => {
      snack.success(t("Form.ChangePasswordSuccess"));
      queryClient.clear();
      logout();
    },
    onError: useHandleAuthError(),
  });
}

export function useGrantUserPermission() {
  return useMutation({
    mutationKey: ["grant-permission"],
    mutationFn: grantUserPermission,
    onSuccess: useHandleAuthSuccess("Form.GrantPermissionSuccess", ["users"]),
    onError: useHandleAuthError(),
  });
}

export function useRevokeUserPermission() {
  return useMutation({
    mutationKey: ["revoke-permission"],
    mutationFn: revokeUserPermission,
    onSuccess: useHandleAuthSuccess("Form.RevokePermissionSuccess", [
      "users",
      "user-permissions",
    ]),
    onError: useHandleAuthError(),
  });
}

export function useChangeUserRole() {
  return useMutation({
    mutationKey: ["change-role"],
    mutationFn: changeUserRole,
    onSuccess: useHandleAuthSuccess("Form.ChangeRoleSuccess", ["users"]),
    onError: useHandleAuthError(),
  });
}

export function useCreateRole() {
  return useMutation({
    mutationKey: ["create-role"],
    mutationFn: createRole,
    onSuccess: useHandleAuthSuccess("Form.CreateRoleSuccess", ["roles"]),
    onError: useHandleAuthError(),
  });
}

export function useUpdateRole() {
  return useMutation({
    mutationKey: ["update-role"],
    mutationFn: updateRole,
    onSuccess: useHandleAuthSuccess("Form.UpdateRoleSuccess", ["roles"]),
    onError: useHandleAuthError(),
  });
}

export function useDeleteRole() {
  return useMutation({
    mutationKey: ["delete-role"],
    mutationFn: deleteRole,
    onSuccess: useHandleAuthSuccess("Form.DeleteRoleSuccess", ["roles"]),
    onError: useHandleAuthError(),
  });
}

export function useRestoreRole() {
  return useMutation({
    mutationKey: ["restore-role"],
    mutationFn: restoreRole,
    onSuccess: useHandleAuthSuccess("Form.RestoreRoleSuccess", ["roles"]),
    onError: useHandleAuthError(),
  });
}

export function usePermissionActions() {
  return useQuery({
    queryKey: ["permission-actions"],
    queryFn: getPermissionActions,
    staleTime: 10 * 60 * 1000,
  });
}
export function usePermissionResources() {
  return useQuery({
    queryKey: ["permission-resources"],
    queryFn: getPermissionResources,
    staleTime: 10 * 60 * 1000,
  });
}
export function useAllAvailablePermissions() {
  return useQuery({
    queryKey: ["permission-list"],
    queryFn: getAvailablePermissions,
    staleTime: 10 * 60 * 1000,
  });
}

export function useUserPermissions(id: UserId) {
  return useQuery({
    queryKey: ["user-permissions", id],
    queryFn: () => getUserPermissions(id),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreatePermission() {
  return useMutation({
    mutationKey: ["create-permission"],
    mutationFn: createPermission,
    onSuccess: useHandleAuthSuccess("Form.CreatePermissionSuccess", [
      "permissions",
    ]),
    onError: useHandleAuthError(),
  });
}

export function useUpdatePermission() {
  return useMutation({
    mutationKey: ["update-permission"],
    mutationFn: updatePermission,
    onSuccess: useHandleAuthSuccess("Form.UpdatePermissionSuccess", [
      "permissions",
    ]),
    onError: useHandleAuthError(),
  });
}
