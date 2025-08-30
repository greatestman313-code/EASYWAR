export const config = {
  secret: process.env.MY_SECRET || "no-secret",
  openai: {
    apiKey: process.env.OPENAI_API_KEY || ""
  }
};
