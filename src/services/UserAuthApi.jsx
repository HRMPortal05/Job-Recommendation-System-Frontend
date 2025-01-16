import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const UserAuthApi = createApi({
  reducerPath: "UserAuthApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL + "/api/user/",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (registerData) => {
        return {
          url: "register/",
          method: "POST",
          body: registerData,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    loginUser: builder.mutation({
      query: (loginData) => {
        return {
          url: "login/",
          method: "POST",
          body: loginData,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    forgotpassword: builder.mutation({
      query: (forgotPasswordData) => {
        return {
          url: "send-reset-password-email/",
          method: "POST",
          body: forgotPasswordData,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    changepassword: builder.mutation({
      query: ({ data, access_token }) => {
        return {
          url: "changepassword/",
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    resetpassword: builder.mutation({
      query: ({ data, id, token }) => {
        return {
          url: `/reset-password/${id}/${token}/`,
          method: "POST",
          body: data,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    fetchprofile: builder.mutation({
      query: (access_token) => {
        return {
          url: "profile/",
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    userLogout: builder.mutation({
      query: ({ refresh, access_token }) => ({
        url: "logout/",
        method: "POST",
        body: { refresh },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }),
    }),
    verifyEmail: builder.mutation({
      query: ({ uid, token }) => {
        return {
          url: `verify-email/${uid}/${token}/`,
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useForgotpasswordMutation,
  useResetpasswordMutation,
  useChangepasswordMutation,
  useFetchprofileMutation,
  useUserLogoutMutation,
  useVerifyEmailMutation,
} = UserAuthApi;
