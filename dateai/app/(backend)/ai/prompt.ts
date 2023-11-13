import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

export default function prompt<T extends Record<string, string>, V extends any>(this: any, prompt: TemplateStringsArray): (args: T) => Promise<V> {
    this.p = prompt[0].trimStart();

    return async (args: T) => {
        let prompt = this.p + "";
        Object.keys(args).forEach(k => {
            prompt = prompt.replaceAll(`{${k}}`, args[k]);
        });
        console.log(prompt);
        const chatCompletion = await openai.completions.create({
            prompt: prompt,
            model: 'gpt-3.5-turbo-instruct',
            temperature: 0.2,
            max_tokens: 2000,
        });
        console.log(chatCompletion.choices[0].text.trim());
        return JSON.parse(chatCompletion.choices[0].text.trim()) as V;
    }
}
