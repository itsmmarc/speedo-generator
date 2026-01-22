export function matchClassStartingWith(starting, className) {
    let regex = `\\b${starting}[a-zA-Z\\-\\_]*`;
    return (className.match(regex) || []).join(" ");
}
