export function csvToJSON(csvLines: string[], separator: string): Record<string, string | number>[] {
    if (!csvLines?.length || csvLines.length < 2) {
        throw new Error("Некорректная передача");
    }

    const parsedData: Record<string, string | number>[] = [];

    const headers = csvLines[0].split(separator);

    for (let lineIndex = 1; lineIndex < csvLines.length; lineIndex++) {
        const values = csvLines[lineIndex].split(separator);

        if (headers.length !== values.length) {
            throw new Error("Несовпадение по количеству параметров");
        }

        const rowObject: Record<string, string | number> = {};

        for (let columnIndex = 0; columnIndex < headers.length; columnIndex++) {
            const currentValue = values[columnIndex];

            if (currentValue === "") {
                throw new Error("Передача пустого значения");
            }

            const parsedValue = isNaN(Number(currentValue)) ? currentValue : Number(currentValue);
            rowObject[headers[columnIndex]] = parsedValue;
        }

        parsedData.push(rowObject);
    }

    return parsedData;
}