import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const izhApi = createApi({
  reducerPath: "izhApi",
  tagTypes: ["Users"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://tasks.tizh.ru/v1/user/" }),
  endpoints: (build) => ({
    getUsers: build.query({
      query: () => `index`,
      providesTags: [{ type: "Users" }],
    }),
    getUser: build.query({
      query: (id) => `view?id=${id}`,
    }),
    deleteUser: build.mutation({
      query: (id) => ({
        url: `delete?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Users" }],
    }),
    createUser: build.mutation({
      query: (body) => ({
        url: `create`,
        method: "POST",
        body
      }),
      invalidatesTags: [{ type: "Users" }],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery, useDeleteUserMutation, useCreateUserMutation } =
  izhApi;
