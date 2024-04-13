import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User, FoodList } from "../models/models";

export const izhApi = createApi({
  reducerPath: "izhApi",
  tagTypes: ["Users"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://tasks.tizh.ru/v1/user/" }),
  endpoints: (build) => ({
    getUsers: build.query<User[], string>({
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
    getFood: build.query<FoodList, string>({
      query: () => `get-food-list`,
    }),
    editUser: build.mutation({
      query: ({id, body}) => ({
        url: `update?id=${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Users" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useDeleteUserMutation,
  useCreateUserMutation,
  useGetFoodQuery,
  useEditUserMutation
} = izhApi;
