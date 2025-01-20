import axios from "axios";
import fs from "fs";
import path from "path";
import libraryMetadata from "../library-content/library-metadata.json" assert {type: "json" };
import dotenv from 'dotenv';

dotenv.config();

interface LibraryItem {
    name: string;
    path: string;

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
    packageFileUrl?: string | null;
    packageFileName?: string | null;
    docFileContent?: string | null;
    supportingFiles?: LibraryContent[];
}

const repoRoot = "FKUnitySnippetsLibrary";
const contentUrlRoot = "https://raw.githubusercontent.com/Flavkupe/FKUnitySnippetsLibrary/main/FKUnitySnippetsLibrary";
const htmlUrlRoot = "https://github.com/Flavkupe/FKUnitySnippetsLibrary/blob/main/FKUnitySnippetsLibrary"

const cachedContent: Record<string, string> = {};

const allData: LibraryContent[] = [];

let requestsMade = 0;

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

    console.log("Requests made to API:", requestsMade);
}

async function callUrl(url: string): Promise<string | null> {
    requestsMade++;
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

async function checkIfFileExists(url: string): Promise<boolean> {
    try {
        requestsMade++;
        const response = await axios.head(url);
        return response.status === 200;
    } catch (error) {
        return false;
    }
}

async function getFileContentIfUrlExists(url: string): Promise<string | null> {
    if (cachedContent[url]) {
        return cachedContent[url];
    }

    if (!await checkIfFileExists(url)) {
        return null;
    }

    return getFileContent(url);
}

async function getFileContent(url: string): Promise<string | null> {
    if (cachedContent[url]) {
        return cachedContent[url];
    }

    const fileContent = await callUrl(url);

    if (!fileContent) {
        console.log("Error fetching file content for file", path);
        return null;
    }

    cachedContent[url] = fileContent;

    return fileContent;
}

function getUnityPackageUrl(libraryItem: LibraryItem): string {
    const shortPath = getShortPath(libraryItem);
    return `${contentUrlRoot}/${shortPath}/${libraryItem.name}.unitypackage`;
}

function getDocFileUrl(libraryItem: LibraryItem): string {
    const shortPath = getShortPath(libraryItem);
    return `${contentUrlRoot}/${shortPath}/${libraryItem.name}.md`;
}

function getShortPath(libraryItem: LibraryItem): string {
    return path.dirname(libraryItem.path.replace(`${repoRoot}/`, ""));
}

async function getLibraryItemData(libraryItem: LibraryItem, category: string, isSupportingFile: boolean): Promise<LibraryContent | null> {
    const filename = path.basename(libraryItem.path);
    const demoName = filename.replace(".cs", "");
    const htmlUrl = `${htmlUrlRoot}/${libraryItem.path}`;
    const name = libraryItem.name;
    const shortPath = getShortPath(libraryItem);
    const contentUrl = `${contentUrlRoot}/${libraryItem.path}`;
    const docFileUrl = getDocFileUrl(libraryItem);
    const packageUrl = getUnityPackageUrl(libraryItem);

    const fileContentPromise = getFileContent(contentUrl);

    const supportingFilesPromises: Promise<LibraryContent | null>[] = [];
    for (const supportingFile of libraryItem.supportingFiles || []) {
        supportingFilesPromises.push(getLibraryItemData(supportingFile, category, true));
    }

    const [fileContent, supportingFilesResults, hasPackage, docFileContent] = await Promise.all([
        fileContentPromise,
        Promise.all(supportingFilesPromises),
        isSupportingFile ? Promise.resolve(false) : checkIfFileExists(packageUrl),
        isSupportingFile ? Promise.resolve(null) : getFileContentIfUrlExists(docFileUrl)
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
        docFileContent,
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
