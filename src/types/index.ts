export interface MyCustomType {
    id: string;
    name: string;
    value: number;
}

export type ProjectForm = {
    name?: string;
    path?: string;
    cli?: string;
    ts?: boolean;
    template?: string;
    next_app_router?: boolean;
}
export type ProjectData = {
    name: string;
    dirname: string;
    command: string;
    cwd: string;
    target: string;
    ts: boolean;
    template?: string;
    createdAt?: string;
    updatedAt?: string;
}
export * from "./client";