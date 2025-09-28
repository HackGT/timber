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

export const tableNumberToRoom = (tableNumber: number) => {
  if (tableNumber >= 1 && tableNumber <= 68) {
    return "(Klaus Atrium)";
    // eslint-disable-next-line no-else-return
  } else if (tableNumber >= 69 && tableNumber <= 110) {
    // eslint-disable-next-line no-else-return
    return "(Klaus 1116)";
  } else if (tableNumber >= 111 && tableNumber <= 123) {
    // eslint-disable-next-line no-else-return
    return "(Klaus 2nd Floor)";
  } else if (tableNumber >= 124 && tableNumber <= 153) {
    // eslint-disable-next-line no-else-return
    return "(Klaus 1456)";
  }

  return "N/A";
};
