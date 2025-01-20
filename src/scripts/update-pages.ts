import axios from "axios";
import fs from "fs";
import path from "path";
import libraryMetadata from "../library-content/library-metadata.json" assert {type: "json" };

interface LibraryItem {
    name: string;
    path: string;

    description?: string;

    // this is not a full LibraryItems; supporting files can't have supporting files
    supportingFiles?: LibraryItem[];
}

interface LibraryContent {
    demoName: string;
    category: string;
    fileContent: string;
    name: string;
    shortPath: string;
    filename: string;
    path: string;
    url: string;
    packageFileUrl?: string;
    packageFileName?: string;
    supportingFiles?: LibraryContent[];

}

const repoRoot = "FKUnitySnippetsLibrary";
const contentUrlRoot = "https://raw.githubusercontent.com/Flavkupe/FKUnitySnippetsLibrary/main/FKUnitySnippetsLibrary";
const htmlUrlRoot = "https://github.com/Flavkupe/FKUnitySnippetsLibrary/blob/main/FKUnitySnippetsLibrary"

const cachedContent: Record<string, string> = {};

const allData: LibraryContent[] = [];

async function updatePages() {
    for (const group of libraryMetadata) {
        for (const item of group.items) {
            const data = await getLibraryItemData(item, group.category, false);
            if (data) {
                allData.push(data);
            }
        }
    }

    await writeFileData(allData);
}

async function getLibraryItemContent(libraryItem: LibraryItem): Promise<string | null> {
    const url = `${contentUrlRoot}/${libraryItem.path}`;
    if (cachedContent[url]) {
        return cachedContent[url];
    }

    const fileContent = await axios.get<string>(url);

    if (fileContent.status !== 200 || !fileContent) {
        console.log("Error fetching file content for file", libraryItem.path);
        return null;
    }

    cachedContent[url] = fileContent.data;

    return fileContent.data;
}

function getUnityPackageUrl(libraryItem: LibraryItem): string {
    const path = libraryItem.path.replace(/\.cs$/, '.unitypackage');
    return `${contentUrlRoot}/${path}`;
}

async function checkUnityPackageExists(libraryItem: LibraryItem): Promise<boolean> {
    const url = getUnityPackageUrl(libraryItem);
    try {
        const response = await axios.head(url);
        return response.status === 200;
    } catch (error) {
        return false;
    }
}

async function getLibraryItemData(libraryItem: LibraryItem, category: string, isSupportingFile: boolean): Promise<LibraryContent | null> {
    const fileContent = await getLibraryItemContent(libraryItem);
    if (!fileContent) {
        return null;
    }

    const supportingFiles: LibraryContent[] = [];
    for (const supportingFile of libraryItem.supportingFiles || []) {
        const data = await getLibraryItemData(supportingFile, category, true);
        if (data) {
            supportingFiles.push(data);
        }
    }

    const filename = path.basename(libraryItem.path);
    const demoName = filename.replace(".cs", "");
    const htmlUrl = `${htmlUrlRoot}/${libraryItem.path}`;
    const name = libraryItem.name;
    const shortPath = path.dirname(libraryItem.path.replace(`${repoRoot}/`, ""));
    const values: LibraryContent = {
        demoName,
        fileContent,
        name,
        category,
        shortPath,
        filename,
        path: libraryItem.path,
        url: htmlUrl,
        supportingFiles,
    };

    if (!isSupportingFile) {
        const hasPackage = await checkUnityPackageExists(libraryItem);
        if (hasPackage) {
            values.packageFileUrl = getUnityPackageUrl(libraryItem);
            values.packageFileName = `${demoName}.unitypackage`;
        }
    }

    return values;
}

async function writeFileData(allFileData: LibraryContent[]) {
    const libContentPath = "src/library-content/";
    const libContent = JSON.stringify(allFileData);
    fs.writeFileSync(`${libContentPath}/library-content.json`, libContent, { encoding: "utf8" });
}

updatePages();
