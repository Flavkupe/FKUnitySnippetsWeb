import axios from "axios";
import fs from "fs";
import path from "path";
import libraryMetadata from "../library-content/library-metadata.json" assert {type: "json" };
import dotenv from 'dotenv';

dotenv.config();

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

// use a PAT in .env to make the call authenticated, to avoid rate limiting
const githubToken = process.env.GITHUB_TOKEN;

async function updatePages() {
    const promises: Promise<LibraryContent | null>[] = [];
    for (const group of libraryMetadata) {
        for (const item of group.items) {
            promises.push(getLibraryItemData(item, group.category, false));
        }
    }

    const results = await Promise.all(promises);

    for (const data of results) {
        if (data) {
            allData.push(data);
        }
    }

    await writeFileData(allData);
}

async function callUrl(url: string): Promise<string | null> {
    const response = await axios.get(url, {
        headers: {
            Authorization: githubToken ? `token ${githubToken}` : undefined,
        }
    });

    if (response.status !== 200 || !response.data) {
        console.log("Error fetching url", url);
        return null;
    }

    return response.data;
}

async function getLibraryItemContent(libraryItem: LibraryItem): Promise<string | null> {
    const url = `${contentUrlRoot}/${libraryItem.path}`;
    if (cachedContent[url]) {
        return cachedContent[url];
    }

    const fileContent = await callUrl(url);

    if (!fileContent) {
        console.log("Error fetching file content for file", libraryItem.path);
        return null;
    }

    cachedContent[url] = fileContent;

    return fileContent;
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
    const filename = path.basename(libraryItem.path);
    const demoName = filename.replace(".cs", "");
    const htmlUrl = `${htmlUrlRoot}/${libraryItem.path}`;
    const name = libraryItem.name;
    const shortPath = path.dirname(libraryItem.path.replace(`${repoRoot}/`, ""));

    const fileContentPromise = getLibraryItemContent(libraryItem);

    const supportingFilesPromises: Promise<LibraryContent | null>[] = [];
    for (const supportingFile of libraryItem.supportingFiles || []) {
        supportingFilesPromises.push(getLibraryItemData(supportingFile, category, true));
    }

    const [fileContent, supportingFilesResults, hasPackage] = await Promise.all([
        fileContentPromise,
        Promise.all(supportingFilesPromises),
        isSupportingFile ? Promise.resolve(false) : checkUnityPackageExists(libraryItem)
    ]);

    if (!fileContent) {
        return null;
    }

    const supportingFiles = supportingFilesResults.filter(data => data !== null) as LibraryContent[];

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

    if (!isSupportingFile && hasPackage) {
        values.packageFileUrl = getUnityPackageUrl(libraryItem);
        values.packageFileName = `${demoName}.unitypackage`;
    }

    return values;
}

async function writeFileData(allFileData: LibraryContent[]) {
    const libContentPath = "src/library-content/";
    const libContent = JSON.stringify(allFileData);
    fs.writeFileSync(`${libContentPath}/library-content.json`, libContent, { encoding: "utf8" });
}

updatePages();
