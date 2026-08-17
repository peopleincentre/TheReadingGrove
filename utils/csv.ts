/**
 * A simple CSV parser. It handles quoted fields that may contain commas.
 * It does not handle escaped quotes within a quoted field, but it is
 * sufficient for most common CSV formats, including the one exported
 * by this application.
 * @param csvText The string content of the CSV file.
 * @returns An array of objects representing the rows.
 */
export function parseCSV(csvText: string): Record<string, string>[] {
  const text = csvText.trim().replace(/\r\n/g, '\n');
  const lines = text.split('\n');

  if (lines.length < 2) {
    return []; // Not enough content for headers + data
  }

  // Extract headers and trim them
  const headers = lines[0].split(',').map(h => h.trim());
  const data: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue; // Skip empty lines

    // This regex splits the line by commas, but respects quoted sections.
    const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
    
    if (!values) {
        console.warn(`Skipping empty or invalid CSV row ${i + 1}: ${line}`);
        continue;
    }

    // Clean the values by trimming and removing start/end quotes.
    const cleanedValues = values.map(v => v.trim().replace(/^"|"$/g, '').trim());

    if (cleanedValues.length !== headers.length) {
        console.warn(`Skipping malformed CSV row ${i + 1}: expected ${headers.length} columns, found ${cleanedValues.length}. Line: ${line}`);
        continue;
    }

    const rowObject: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      rowObject[headers[j]] = cleanedValues[j];
    }
    data.push(rowObject);
  }
  return data;
}
