import { readLine, displayTemplateTable, styledText } from "./utils.js";
import colors from "./colors.js";

const createTemplate = async () => {
    const { getStoredTemplates, pathExists, saveTemplates } = await import("./fileService.js");
    const templates = await getStoredTemplates();
    let isTemplatePathValid = false;
    let isTemplateNameValid = false;
    let templateFilePath = "";
    let templateName = "";
    let templateDescription = "";

    do {
        try {
            templateFilePath = await readLine("Please enter the template file path: ");

            if (!(await pathExists(templateFilePath))) {
                console.log(styledText("The specified path is not a valid file.", colors.red, false));
            } else {
                isTemplatePathValid = true;
            }
        } catch (err) {
            throw new Error(err.message);
        }
    } while (!isTemplatePathValid);

    do {
        templateName = await readLine("Please enter the template name: ");

        if (templates.find((template) => template.name == templateName)) {
            console.log(styledText("A template with the same name already exists.", colors.red, false));
        } else {
            isTemplateNameValid = true;
        }
    } while (!isTemplateNameValid);

    templateDescription = await readLine("Please enter a description (optional): ");
    templates.push({ name: templateName, path: templateFilePath, description: templateDescription });

    try {
        await saveTemplates(templates);
    } catch (err) {
        throw new Error(err.message);
    }
};

const displayTemplates = async () => {
    const { getStoredTemplates } = await import("./fileService.js");
    const templates = await getStoredTemplates();

    if (templates.length > 0) {
        displayTemplateTable(templates);
    } else {
        console.log("No templates found.");
    }
};

const deleteTemplate = async () => {
    const { saveTemplates, getStoredTemplates } = await import("./fileService.js");
    const templates = await getStoredTemplates();
    const isTemplateNameValid = false;

    if (templates.length > 0) {
        displayTemplateTable(templates);

        do {
            const templateName = await readLine("Please enter the template name to delete: ");

            const templateIndex = templates.findIndex((template) => template.name == templateName);

            if (templateIndex < 0) {
                console.log(styledText("The specified template does not exist.", colors.red, false));
            } else {
                templates.splice(templateIndex, 1);

                try {
                    await saveTemplates(templates);
                } catch (err) {
                    throw new Error(err.message);
                }
            }
        } while (!isTemplateNameValid);
    } else {
        console.log("No templates found.");
    }
};

const createFile = async (currentDirectory) => {
    const { createFileFromTemplate, getStoredTemplates } = await import("./fileService.js");
    const templates = await getStoredTemplates();
    let isTemplateNameValid = false;

    if (templates.length > 0) {
        displayTemplateTable(templates);

        do {
            const templateName = await readLine("Please enter the template name to create a file: ");

            const template = templates.find((template) => template.name == templateName);

            if (!template) {
                console.log(styledText("The specified template does not exist.", colors.red, false));
            } else {
                try {
                    await createFileFromTemplate(template, currentDirectory);
                    isTemplateNameValid = true;
                } catch (err) {
                    throw new Error(err.message);
                }
            }
        } while (!isTemplateNameValid);
    } else {
        console.log("No templates found.");
    }
};

const displayHelp = () => {
    const helpMessage =
        styledText("Usage:", colors.bold, true) +
        "\n" +
        "    fileTemplater [command]\n\n" +
        styledText("Commands:", colors.bold, true) +
        "\n" +
        "    createTemplate          Create a new template by specifying a template file path and name.\n" +
        "    templates               List all available templates saved in the system.\n" +
        "    deleteTemplate          Delete a template by selecting it from the list of saved templates.\n" +
        "    createFile              Create a file from a selected template in the current directory.\n" +
        "    help                    Display the help message with information about the available commands.\n\n" +
        "Each command will open a prompt to guide you through the process.";

    console.log(helpMessage);
};

export { createTemplate, displayTemplates, deleteTemplate, createFile, displayHelp };
