export function matchClassStartingWith(starting: string, className: string): string {
        let regex = "".concat("\\b", starting, "[a-zA-Z\\-\\_]*");
        return (className.match(regex) || []).join(" ");
}
