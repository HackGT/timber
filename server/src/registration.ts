import axios from "axios";

export async function queryRegistration(
  query: string,
  variables?: { [name: string]: string }
): Promise<any> {
  try {
    const response = await axios.post(
      process.env.REGISTRATION_URL || "",
      {
        query,
        variables: variables || {},
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${Buffer.from(
            process.env.REGISTRATION_GRAPHQL_AUTH || "",
            "utf8"
          ).toString("base64")}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(JSON.stringify(error.response.data));
  }
}
