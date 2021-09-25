import { Rule } from "antd/es/form";

export const FORM_RULES = {
  requiredRule: {
    required: true,
    message: "This field is required."
  },
  urlRule: {
    type: "url",
    message: "Please enter a valid URL."
  } as Rule,
  emailRule: {
    type: "email",
    message: "Please enter a valid email."
  } as Rule
};

export const FORM_LAYOUT = {
  full: {
    xs: 24, sm: 24, md: 16, lg: 12, xl: 12
  }
}