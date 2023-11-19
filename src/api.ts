// api.ts
export const query = async (data: Record<string, unknown>): Promise<Blob> => {
    try {
      const response = await fetch("https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud", {
        headers: {
          "Accept": "image/png",
          "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data),
      });
  
      const result = await response.blob();
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error in API request: ${error.message}`);
      } else {
        throw new Error(`Unknown error in API request`);
      }
    }
  };
  