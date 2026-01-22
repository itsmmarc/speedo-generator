/**
 * Checks if a class name starts with a particular string
 * @param starting Beginning string to filter class name
 * @param className Class name to check for match
 * @returns className param if the string begins with the starting param, else returns an empty string
 */
export function matchClassStartingWith(starting: string, className: string): string {
        let regex = `\\b${starting}[a-zA-Z\\-\\_]*`;
        return (className.match(regex) || []).join(" ");
}
