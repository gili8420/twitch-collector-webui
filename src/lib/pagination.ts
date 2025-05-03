export function getPageWindow(
    currentPage: number,
    totalPages: number,
    windowSize = 10
): number[] {
    const pages: (number)[] = [];
    const half = Math.floor(windowSize / 2);
    let start = Math.max(1, currentPage - half);
    let end   = start + windowSize - 1;

    if (end > totalPages) {
        end   = totalPages;
        start = Math.max(1, end - windowSize + 1);
    }

    for (let i = start; i <= end; i++)
        pages.push(i);

    return pages;
}
