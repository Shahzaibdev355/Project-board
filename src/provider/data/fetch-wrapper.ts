import { GraphQLFormattedError } from "graphql";

type Error = {
  message: string;
  statusCode: string;
};

// A kind of middleware for fetch
const customFetch = async (url: string, options: RequestInit) => {
  // This is a property (likely from an options object) that is expected to contain headers, usually in the form of key-value pairs.
  // which is a TypeScript type that represents an object where: The keys are strings. The values are also strings.

  const accessToken = localStorage.getItem("access_token");
  const headers = options.headers as Record<string, string>;

  return await fetch(url, {
    ...options,
    headers: {
      ...headers,
      Authorization: headers?.Authorization || `Bearer: ${accessToken}`,
      "Content-Type": "application/json",
      "Apollo-Require-Preflight": "true",
    },
  });
};

export const fetchWrapper = async (url: string, options: RequestInit) => {
  const response = await customFetch(url, options);

  const responseClone = response.clone();
  const body = await responseClone.json();
  const error = getGraphQLErrors(body);

  if (error) {
    throw error;
  }

  return response;
};

const getGraphQLErrors = (
  body: Record<"errors", GraphQLFormattedError[] | undefined>
): Error | null => {
  if (!body) {
    return {
      message: "Unknown error",
      statusCode: "INTERNAL_SERVER_ERROR",
    };
  }

  if ("errors" in body) {
    const errors = body?.errors;
    const messages = errors?.map((error) => error?.message)?.join("");
    const code = errors?.[0]?.extensions?.code;

    return {
      message: messages || JSON.stringify(errors),
      statusCode: code || 500,
    };
  }

  return null;
};
