export type announcementRequestDto = {
    description: string,
    publishDate: string,
}

export type announcementResponseDto = {
    id: number,
    description: string,
    publishDate: string,
    published: boolean,
}
export type announcementDeleteRequestDto = {
    id: number;
}