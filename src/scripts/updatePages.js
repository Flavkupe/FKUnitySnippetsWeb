import axios from "axios";
import fs from "fs";
import path from "path";

const repoRoot = "FKUnitySnippetsLibrary";
const repo = "https://api.github.com/repos/Flavkupe/FKUnitySnippetsLibrary/contents";

const allData = [];

async function updatePages() {
    await updateDirectory(repoRoot);
    await writeFileData(allData);
}

async function updateDirectory(directoryPath) {
    const contents = await axios.get(`${repo}/${directoryPath}`);
    const data = contents.data;
    
    for (let i = 0; i < data.length; i++) {
        const content = data[i];
        if (content.type === "dir") {
            await updateDirectory(content.path);
        } else {
            const fileData = await getFileData(content);
            if (fileData) {
                allData.push(fileData);
            }
        }
    }
}

async function writeFileData(allFileData) {
    const libContentPath = "src/library-content/";
    const libContent = JSON.stringify(allFileData);
    fs.writeFileSync(`${libContentPath}/library-content.json`, libContent, { encoding: "utf8" });
}

async function getFileData(fileData) {
    if (!fileData.name.endsWith(".cs") || fileData.size === 0) {
        return;
    }

    const fileContent = await axios.get(fileData.download_url);
    if (fileContent.status !== 200 || !fileContent) {
        console.log("Error fetching file content for file", fileData);
        return;
    }

    const name = fileData.name.split(".")[0];
    const shortPath = path.dirname(fileData.path.replace(`${repoRoot}/`, ""));
    return {
        fileContent: fileContent.data,
        name,
        shortPath,
        filename: fileData.name,
        path: fileData.path,
        url: fileData.html_url,
    };
}

updatePages();
