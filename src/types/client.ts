export type ProjectQuery = {
    current: number;
    pageSize: number;
    keyword?: string;
}
export type ProjectPayload = {
    command: string,
    name?: string,
    path?: string,
    template?: string
    ts?: boolean
}

export type MessageTargetPayload = {
    target: string,
}

export type MessageTitlePayload = {
    title: string,
}