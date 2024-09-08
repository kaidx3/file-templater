import { exit } from "process";
import colors from "./colors.js";

const readLine = (query) => {
    return new Promise(async (resolve) => {
        const readline = await import("readline");
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question(query, (answer) => {
            resolve(answer);
            rl.close();
        });
    });
};

const exitWithCode = (message, code = 0) => {
    if (message) {
        console.log(message);
    }
    exit(code);
};

const styledText = (text, color, isBold = false) => {
    const boldCode = isBold ? colors.bold : "";
    return `${boldCode}${color}${text}${colors.reset}`;
};

const displayTemplateTable = (templates) => {
    console.table(
        templates.map((template) => ({
            Name: template.name,
            Path: template.path,
            Description: template.description,
        }))
    );
};

export { readLine, exitWithCode, styledText, displayTemplateTable };
