import OpenAI from "openai";

interface Options {
    prompt: string;
}


export const orthographyCheckUseCase = async (openai: OpenAI, options: Options) => {
    const { prompt } = options;

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system", content: `
                Entrada: Un texto con posibles errores ortográficos o gramaticales.

                Salida:
                {
                  "texto_corregido": "El texto corregido con los errores identificados y corregidos.",
                  "porcentaje_fallo": "El porcentaje de errores identificados en el texto original.",
                  "mensaje_animo": "Un mensaje de ánimo con un emoji para levantar el ánimo del usuario."
                }
                
                Ejemplo:
                Entrada: "Hoy hace mucho calor y los niño juegan en el parque."
                Salida:
                {
                  "texto_corregido": "Hoy hace mucho calor y los niños juegan en el parque.",
                  "porcentaje_fallo": "20%",
                  "mensaje_animo": "¡Bien hecho! 🎉 Sigue así, ¡tu esfuerzo vale la pena! 💪"
                }
                
                `
            },
            {
                role: "user", content: prompt
            }
        ],
        model: "gpt-3.5-turbo",

    }
    );

    const jsonResp = JSON.stringify(completion.choices[0].message.content);
    return JSON.parse(jsonResp);

    return {
        prompt: prompt,
        api: process.env.OPENAI_API_KEY
    };
};
