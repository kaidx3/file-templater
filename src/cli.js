#!/usr/bin/env node

import colors from "./colors.js";
import { exitWithCode, styledText } from "./utils.js";

const args = process.argv.slice(2);

(async () => {
    try {
        switch (args[0]) {
            case "createTemplate":
                const { createTemplate } = await import("./fileTemplaterCLI.js");
                await createTemplate();
                break;
            case "templates":
                const { displayTemplates } = await import("./fileTemplaterCLI.js");
                await displayTemplates();
                break;
            case "deleteTemplate":
                const { deleteTemplate } = await import("./fileTemplaterCLI.js");
                await deleteTemplate();
                break;
            case "createFile":
                const { createFile } = await import("./fileTemplaterCLI.js");
                await createFile(process.cwd());
                break;
            case "help":
                const { displayHelp } = await import("./fileTemplaterCLI.js");
                displayHelp();
                break;
            default:
                throw new Error(
                    "Invalid command. Please use one of the following commands: createTemplate, templates, deleteTemplate, createFile, help."
                );
        }
        exitWithCode(styledText("Operation completed successfully.", colors.green, false), 0);
    } catch (err) {
        exitWithCode(styledText(err.message, colors.red, false), 1);
    }
})();
