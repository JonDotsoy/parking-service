import dotenv from "npm:dotenv";

const { parsed } = dotenv.config({
  path: new URL("../../.env", import.meta.url).pathname,
});

export const config = parsed!;
