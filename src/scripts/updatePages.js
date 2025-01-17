import axios from "axios";

const repoRoot = "FKUnitySnippetsLibrary";
const repo = "https://api.github.com/repos/Flavkupe/FKUnitySnippetsLibrary/contents";

async function updatePages() {
    updateDirectory(repoRoot);
}

async function updateDirectory(directoryPath) {
    const contents = await axios.get(`${repo}/${directoryPath}`);
    const data = contents.data;
    for (let i = 0; i < data.length; i++) {
        const content = data[i];
        if (content.type === "dir") {
            console.log("DIR");
            await updateDirectory(content.path);
        } else {
            console.log("FILE");
            await updateFiles(content);
        }
    }
}

async function updateFiles(fileData) {
    console.log(fileData);
    if (!fileData.name.endsWith(".cs")) {
        return;
    }

    const fileContent = await axios.get(fileData.download_url);
    console.log(fileData.name);
    console.log(fileContent);
}

updatePages();
