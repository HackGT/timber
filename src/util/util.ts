import { message } from "antd";
import { Rule } from "antd/es/form";
import axios, { AxiosError } from "axios";

export const FORM_RULES = {
  requiredRule: {
    required: true,
    message: "This field is required.",
  },
  urlRule: {
    type: "url",
    message: "Please enter a valid URL.",
  } as Rule,
  emailRule: {
    type: "email",
    message: "Please enter a valid email.",
  } as Rule,
  maxLengthRule: {
    type: "number",
    max: 30,
    message: "Project name cannot exceed 30 characters",
  } as Rule & { max?: number },
};

export const FORM_LAYOUT = {
  full: {
    xs: 24,
    sm: 24,
    md: 16,
    lg: 12,
    xl: 12,
  },
};

export const handleAxiosError = (error: Error | AxiosError<any>) => {
  console.log("Axios");
  console.error(error);
  if (axios.isAxiosError(error) && error.response) {
    if (error.response?.data.error || error.response?.data.message) {
      message.error(error.response?.data.message, 2);
    } else {
      console.error(error.response);
      message.error("Error: Please ask for help. There was a networking error.", 2);
    }
  } else {
    console.log("Inside else");
    console.error(error);
    message.error("Error: Please ask for help. There was an unknown error.", 2);
  }
};

/**
 * add a prefix letter to table number depending on room
 * 
 * hackgt13 temp
 */
export function HG13_TMP_spoofTableNumber(
  tableNumber: number | string | undefined | null,
  roomName: string | undefined | null
): string {
  if (tableNumber === undefined || tableNumber === null || tableNumber === "") {
    return "N/A";
  }

  const table = Number(tableNumber);
  const room = roomName ?? "";

  if (Number.isNaN(table)) {
    return String(tableNumber);
  }

  // in order of fallbacks
  if (room === "Klaus Atrium") {
    return `A${table}`;
  }
  if (room.includes("1116")) {
    return `B${table-86}`;
  }
  if (room === "Klaus Atrium 2") {
    return `A${table + 86}`;
  }
  if (room.includes("1456")) {
    return `C${table}`;
  }
  // 1447 shares code C with 1456, continuing after 1456's 25 tables
  if (room.includes("1447")) {
    return `C${table + 25}`;
  }

  return String(table);
}
