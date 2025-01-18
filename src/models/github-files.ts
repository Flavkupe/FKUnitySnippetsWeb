export interface GithubFile {
    /**
     * Name for display etc, eg "Bounce"
     */
    name: string;

    /**
     * Name and extension, eg "Bounce.cs"
     */
    filename: string;

    /**
     * Path to file, eg "FKUnitySnippetsLibrary/Transformations/Bounce.cs"
     */
    path: string;

    /**
     * Relative path in repo without filename, eg "Transformations"
     */
    shortPath: string;

    /**
     * Github URL to file, eg "https://github.com/Flavkupe/FKUnitySnippetsLibrary/blob/main/FKUnitySnippetsLibrary/Transformations/Bounce.cs"
     */
    url: string;

    /**
     * The actual string contents of the file.
     */
    fileContent: string;
}
