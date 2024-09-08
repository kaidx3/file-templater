import fs from "fs";
import { exitWithCode, readLine } from "./utils.js";
import path from "path";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modulePath = path.join(__dirname, "..");
const jsonPath = path.join(modulePath, "templates.json");

const confirmOverwrite = async () => {
    const shouldContinue = await readLine(
        "An error occurred while reading templates.json. Continuing will create a new templates.json file. Do you want to continue? (y/n): "
    );

    if (shouldContinue.toLowerCase() !== "y") {
        exitWithCode("Operation aborted.", 0);
    }

    try {
        await createBlankTemplatesFile();
    } catch (err) {
        throw new Error(err.message);
    }
};

const saveTemplates = async (templates) => {
    try {
        const filteredTemplates = templates.filter((template) => fs.existsSync(template.path));
        await fs.promises.writeFile(jsonPath, JSON.stringify(filteredTemplates));
    } catch (err) {
        throw new Error("An error occurred while saving the template.");
    }
};

const getStoredTemplates = async () => {
    let templates = [];
    let overwritePrompt = false;

    try {
        if (fs.existsSync(jsonPath)) {
            const templatesJson = await fs.promises.readFile(jsonPath, "utf8");
            let tempTemplates = [];

            if (templatesJson.trim() != "") {
                tempTemplates = JSON.parse(templatesJson);
            }

            if (tempTemplates && Array.isArray(tempTemplates)) {
                templates = tempTemplates;
            } else {
                overwritePrompt = true;
            }
        } else {
            templates = [];
        }
    } catch (err) {
        overwritePrompt = true;
    }

    if (overwritePrompt) {
        await confirmOverwrite();
    }

    if (templates.length > 0) {
        await saveTemplates(templates);
    }

    return templates;
};

const createFileFromTemplate = async (template, currentDirectory) => {
    const fileContent = await fs.promises.readFile(template.path, "utf8");
    const fileName = await readLine("Please enter the file name: ");
    const filePath = `${currentDirectory}/${fileName}`;

    try {
        await fs.promises.writeFile(filePath, fileContent);
    } catch (err) {
        throw new Error("An error occurred while creating the file.");
    }
};

const pathExists = async (path) => {
    try {
        await fs.promises.access(path, fs.constants.F_OK);
        return (await fs.promises.lstat(path)).isFile();
    } catch (err) {
        throw new Error(`Error checking path.`);
    }
};

const createBlankTemplatesFile = async () => {
    try {
        await fs.promises.writeFile(jsonPath, JSON.stringify([]));
    } catch (err) {
        throw new Error("An error occurred while creating the templates file.");
    }
};

export { getStoredTemplates, createFileFromTemplate, saveTemplates, pathExists, createBlankTemplatesFile };
