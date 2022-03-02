import { Box } from "@primer/react";
import type { NextPage } from "next";
import Papa from "papaparse";
import { useMemo } from "react";
import DataGrid from "../datagrid";
import {
  getColumnWidths,
  getFieldTypes,
  getNullFields,
} from "../utils/csvUtils";
import { properCase } from "../utils/properCase";

interface Props {
  selectedFileContent: string | undefined;
}

const CSVPreview: NextPage<Props> = ({ selectedFileContent }) => {
  const [data, headers] = useMemo(() => {
    const results = Papa.parse(selectedFileContent!, {
      header: true,
      dynamicTyping: true,
    });
    const fieldTypes = getFieldTypes(results);
    const nullFields = getNullFields(fieldTypes);
    const columnWidths = getColumnWidths(results);
    const fields = results.meta
      .fields!.filter((field) => !nullFields.includes(field))
      .map((field) => ({
        name: properCase(field),
        field: field,
        type: fieldTypes[field],
        width: columnWidths[field],
      }));
    const data = results.data.map((row: any) => {
      for (const nullField of nullFields) {
        delete row[nullField];
      }
      return { ...row };
    });
    return [data, fields];
  }, [selectedFileContent]);

  return (
    <Box bg="canvas.default" color="fg.default" width="100%" height="100%">
      {selectedFileContent && (
        <DataGrid headers={headers} data={data}></DataGrid>
      )}
    </Box>
  );
};

export default CSVPreview;
