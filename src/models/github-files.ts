export interface GithubFile {
    name: string;
    download_url: string;
}

export interface GithubAccessibleFile extends GithubFile {
    displayName: string;
    componentName: string;
}
