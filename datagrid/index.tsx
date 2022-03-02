import { Box, Text, TextInput, useTheme } from "@primer/react";
import { matchSorter } from "match-sorter";
import type { NextPage } from "next";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useAsyncDebounce,
  useBlockLayout,
  useFilters,
  useGlobalFilter,
  useSortBy,
  useTable,
} from "react-table";
import { FixedSizeList as List } from "react-window";
import { Styles } from "./styles";

const minWidth = 175;

interface Header {
  name: string;
  field: string;
  type: string;
  width: number;
}

interface Props {
  data: any[];
  headers: Header[];
}

const DataGrid: NextPage<Props> = ({ data, headers }) => {
  const { colorScheme } = useTheme();
  const theme = colorScheme!.includes("dark") ? "dark" : "light";
  const ref = useRef<any>(null);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    function handleResize() {
      if (ref.current) {
        setHeight(ref.current.clientHeight);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const GlobalFilter = ({ globalFilter, setGlobalFilter, rows }: any) => {
    const count = rows.length;
    const [value, setValue] = useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
      setGlobalFilter(value || undefined);
    }, 200);

    return (
      <Box
        borderColor="border.default"
        borderWidth={1}
        borderStyle="solid"
        p={1}
        width="100%"
        position="fixed"
        bg="canvas.default"
        style={{ zIndex: 10 }}
      >
        <TextInput
          value={value || ""}
          onChange={(event: FormEvent<HTMLInputElement>) => {
            setValue(event.currentTarget.value);
            onChange(event.currentTarget.value);
          }}
          placeholder="Search all..."
        />{" "}
        {`${count.toLocaleString(undefined)} records`}
      </Box>
    );
  };

  const DefaultColumnFilter = ({ column: { filterValue, setFilter } }: any) => {
    const [value, setValue] = useState(filterValue);
    const onChange = useAsyncDebounce((value) => {
      setFilter(value || undefined);
    }, 200);
    return (
      <Box>
        <TextInput
          value={value || ""}
          onChange={(event: FormEvent<HTMLInputElement>) => {
            setValue(event.currentTarget.value);
            onChange(event.currentTarget.value);
          }}
          placeholder={`Search`}
        />
      </Box>
    );
  };

  const NumberRangeColumnFilter = ({ column: { setFilter } }: any) => {
    const handleSetMinValue = useAsyncDebounce((val) => {
      setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]]);
    }, 200);
    const handleSetMaxValue = useAsyncDebounce((val) => {
      setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined]);
    }, 200);
    return (
      <Box display="flex">
        <TextInput
          size="small"
          type="number"
          onChange={(event: FormEvent<HTMLInputElement>) => {
            const val = event.currentTarget.value;
            handleSetMinValue(val);
          }}
          placeholder="Min"
        />
        <Text m={1}>to</Text>
        <TextInput
          size="small"
          type="number"
          onChange={(event: FormEvent<HTMLInputElement>) => {
            const val = event.currentTarget.value;
            handleSetMaxValue(val);
          }}
          placeholder="Max"
        />
      </Box>
    );
  };

  const fuzzyTextFilterFn = (rows: any[], id: any, filterValue: any) => {
    return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
  };

  fuzzyTextFilterFn.autoRemove = (val: any) => !val;

  const filterGreaterThan = (rows: [], id: any, filterValue: any) => {
    return rows.filter((row: any) => {
      const rowValue = row.values[id];
      return rowValue >= filterValue;
    });
  };

  filterGreaterThan.autoRemove = (val: any) => typeof val !== "number";

  const TableElement = ({ columns, data, height }: any) => {
    const filterTypes = useMemo(
      () => ({
        fuzzyText: fuzzyTextFilterFn,
        text: (rows: [], id: any, filterValue: any) => {
          return rows.filter((row: any) => {
            const rowValue = row.values[id];
            return rowValue !== undefined
              ? String(rowValue)
                  .toLowerCase()
                  .startsWith(String(filterValue).toLowerCase())
              : true;
          });
        },
      }),
      []
    );

    const defaultColumn = useMemo(
      () => ({
        Filter: DefaultColumnFilter,
        width: 200,
      }),
      []
    );

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      totalColumnsWidth,
      prepareRow,
      state,
      preGlobalFilteredRows,
      setGlobalFilter,
    }: any = useTable(
      {
        columns,
        data,
        defaultColumn,
        // @ts-ignore
        filterTypes,
      },

      useBlockLayout,
      useFilters,
      useGlobalFilter,
      useSortBy
    );

    const RenderRow = useCallback(
      ({ index, style }) => {
        const row = rows[index];
        prepareRow(row);
        return (
          <Box
            {...row.getRowProps({
              style,
            })}
            className="tr"
          >
            {row.cells.map((cell: any) => {
              return (
                <Box
                  {...cell.getCellProps()}
                  className="td"
                  borderColor="border.default"
                  borderWidth={1}
                  borderStyle="solid"
                  p={1}
                >
                  <Text m={1}>{cell.render("Cell")}</Text>
                </Box>
              );
            })}
          </Box>
        );
      },
      [prepareRow, rows]
    );

    return (
      <Box {...getTableProps()} className="table">
        <Box>
          {headerGroups.map((headerGroup: any) => (
            <Box {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column: any) => (
                <Box
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="th"
                  borderColor="border.default"
                  borderWidth={1}
                  borderStyle="solid"
                  p={1}
                >
                  <Box display="flex">
                    {" "}
                    <Box>
                      <Text m={1}>{column.render("Header")}</Text>
                    </Box>
                    <Box>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " ▼"
                          : " ▲"
                        : ""}
                    </Box>
                  </Box>
                  <Box m={1}>
                    {column.canFilter ? column.render("Filter") : null}
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
          <Box>
            <Box textAlign="left">
              <GlobalFilter
                rows={rows}
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </Box>
          </Box>
        </Box>

        <Box {...getTableBodyProps()} mt={7}>
          <List
            height={height}
            itemCount={rows.length}
            itemSize={35}
            width={totalColumnsWidth}
          >
            {RenderRow}
          </List>
        </Box>
      </Box>
    );
  };

  const columns = headers.map((header) => {
    const calcWidth = header.width * 8;
    const updatedColumns = {
      Header: header.name,
      accessor: header.field,
      Filter: header.type === "number" ? NumberRangeColumnFilter : false,
      filter: header.type === "number" ? "between" : "fuzzyText",
      width: calcWidth > minWidth ? calcWidth : minWidth,
    };
    if (updatedColumns.Filter === false) {
      delete (updatedColumns as any)["Filter"];
    }
    return updatedColumns;
  });

  return (
    <Box ref={ref} height="100%" color="fg.muted">
      <Styles>
        {height && (
          <TableElement columns={columns} data={data} height={height} />
        )}
      </Styles>
    </Box>
  );
};

export default DataGrid;
