import Papa from "papaparse";

interface FieldTypes {
  [key: string]: string;
}

export const getFieldTypes = (result: Papa.ParseResult<any>) => {
  const rows = result.data;
  const fields = result.meta.fields;
  function getType(col: string) {
    let fieldType;
    for (const row of rows) {
      if (row[col] !== null && row[col] !== undefined) {
        fieldType = typeof row[col];
        break;
      } else {
        fieldType = null;
      }
    }
    return fieldType;
  }
  let fieldTypes: FieldTypes = {};
  for (const field of fields!) {
    fieldTypes[field] = getType(field)!;
  }
  return fieldTypes;
};

export const getNullFields = (obj: FieldTypes) =>
  Object.entries(obj)
    .filter((entry) => entry[1] === null)
    .map((entry) => entry[0]);

export const getColumnWidths = (result: Papa.ParseResult<any>) => {
  const widths = new Map<string, number>();
  const header = result.meta.fields!.map((field) => [field, field]);
  const headerRow = Object.fromEntries(header);
  const data = [...result.data, headerRow];
  for (const row of data) {
    const entries = Object.entries(row);
    for (const entry of entries) {
      const [key, value] = entry;
      const length = value !== null ? (value as any).toString().length : 0;
      const prevValue = widths.get(key);
      if (!prevValue || length > prevValue) {
        widths.set(key, length);
      }
    }
  }
  const columnWidths = Object.fromEntries(widths);
  return columnWidths;
};
