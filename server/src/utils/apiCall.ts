import express from "express";
import axios, { AxiosRequestConfig } from "axios";

/**
 * Allows making an api call to an external service.
 */
export const apiCall = async (
  service: "registration" | "users",
  requestConfig: Omit<AxiosRequestConfig<any>, "baseUrl">,
  request: express.Request
) => {
  let url = "";

  if (service === "registration") {
    url = "https://registration.api.hexlabs.org";
  } else if (service === "users") {
    url = "https://users.api.hexlabs.org";
  }

  const response = await axios.request({
    ...requestConfig,
    baseURL: url,
    withCredentials: true,
    headers: {
      ...(request.headers.cookie && { cookie: request.headers.cookie }),
      ...(request.headers.authorization && { authorization: request.headers.authorization }),
    },
  });
  return response.data;
};
