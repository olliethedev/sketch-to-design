const systemPrompt = `
You are are a world class designer and an expert Tailwind developer like Adam Wathan.
You are given wireframes of a web page and then you will build single page apps using Tailwind, HTML and JS.
You might also be given examples of a reference web page from the user with additional notes.

- If given wireframes, make sure to use best design principles to build a beautiful looking web app.
- If given examples, make sure the app looks similar to the screenshot with edits to reflect user notes.
- If given images, Pay close attention to background color, text color, font size, font family, 
padding, margin, border, etc. Match the colors and sizes exactly.
- Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
- Repeat elements as needed to match the image provided. For example, if there are 15 items, the code should have 15 items. DO NOT LEAVE comments like "<!-- Repeat for each news item -->" or bad things will happen.
- For images inside the app, use placeholder images from https://placehold.co and include a detailed description of the image in the alt text so that an image generation AI can generate the image later.

In terms of libraries,

- Use this script to include Tailwind: <script src="https://cdn.tailwindcss.com"></script>
- You can use Google Fonts
- Font Awesome for icons: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>

When responding, return ONLY the full code in <html></html> tags or bad things will happen.
`;

export async function generateHtml({
    apiKey,
    image,
  }: {
    image: string;
    apiKey: string;
  }): Promise<any> {
    const body: GPT4VCompletionRequest = {
      model: "gpt-4-vision-preview",
      max_tokens: 4096,
      temperature: 0,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: image,
                detail: "high",
              },
            },
            {
              type: "text",
              text: "Create this. Make it look as beautiful as possible.",
            },
          ],
        },
      ],
    };
  
    let json = null;
    if (!apiKey) {
      throw Error("You need to provide an OpenAI API key.");
    }
  
    try {
      const resp = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(body),
        }
      );
  
      json = await (
        resp as { json: () => Promise<GPT4VCompletionRequest> }
      ).json();
    } catch (e:any) {
      throw new Error("Failed to get response from OpenAI API" + e.message);
    }
  
    if (json !== null) {
      return json as GPT4VCompletionRequest;
    } else {
      throw new Error("Failed to get response from OpenAI API");
    }
  }
  
  type MessageContent =
    | string
    | (
        | string
        | {
            type: "image_url";
            image_url:
              | string
              | {
                  url: string;
                  detail: "low" | "high" | "auto";
                };
          }
        | {
            type: "text";
            text: string;
          }
      )[];
  
  export type GPT4VCompletionRequest = {
    model: "gpt-4-vision-preview";
    messages: {
      role: "system" | "user" | "assistant" | "function";
      content: MessageContent;
      name?: string | undefined;
    }[];
    functions?: any[] | undefined;
    function_call?: any | undefined;
    stream?: boolean | undefined;
    temperature?: number | undefined;
    top_p?: number | undefined;
    max_tokens?: number | undefined;
    n?: number | undefined;
    best_of?: number | undefined;
    frequency_penalty?: number | undefined;
    presence_penalty?: number | undefined;
    logit_bias?:
      | {
          [x: string]: number;
        }
      | undefined;
    stop?: (string[] | string) | undefined;
  };