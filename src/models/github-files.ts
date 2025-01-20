export interface GithubFile {
    /**
     * Name for display etc, eg "Bounce"
     */
    name: string;

    /**
     * Name that is used to match up the demo in the game applet
     * (eg, "BezierDemo" for "BezierDemo.cs").
     */
    demoName: string;

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

    /**
     * Optional contents of an md file that describes the demo.
     */
    docFileContent?: string | null;

    /**
     * List of files that are shown alongside this file (eg, Bezier.cs for BezierDemo.cs).
     */
    supportingFiles?: GithubFile[];

    /**
     * If available, the URL to the package file for the current demo.
     */
    packageFileUrl?: string;

    /**
     * If available, the name of the package file for the current demo.
     */
    packageFileName?: string;

    /**
     * Shared group for multiple files, eg "Transformations"
     */
    category: string;
}
