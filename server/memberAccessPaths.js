const programMemberPaths = new Map([
    ["zepter-acht-wochen", "/mitglieder/programme/zepter"],
]);

export const getProgramMemberPath = (slug) => (
    programMemberPaths.get(String(slug || "").trim().toLowerCase()) || ""
);

export const resolveMemberAccessRedirect = (value) => {
    const requestedPath = String(value || "").trim();
    return [...programMemberPaths.values()].includes(requestedPath)
        ? requestedPath
        : "/mitglieder?state=verified";
};
