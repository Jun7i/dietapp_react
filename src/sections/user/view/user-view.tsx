import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';


interface FetchedFoodData {
  code: string;
  product_name: string;
  pnns_groups_1: string | null; // Handle potential nulls from DB
  nutriscore_score: number | string | null; // Handle potential nulls/different types
  brands: string | null;
  image_url: string | null;
  categories: string | null;
  calories: string | null; // New field for calories
}
// ----------------------------------------------------------------------

export function UserView() {

  const table = useTable();
  const [tableData, setTableData] = useState<FetchedFoodData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTableData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3001/api/foods/table'); // Point to your table endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: FetchedFoodData[] = await response.json();
        setTableData(data);
      } catch (e) {
         console.error("Failed to fetch food table data:", e);
         if (e instanceof Error) {
           setError(`Failed to load data: ${e.message}`);
         } else {
           setError("Failed to load data due to an unknown error.");
         }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTableData();
  }, []); // Empty dependency array means this runs once
  
  const [filterName, setFilterName] = useState('');

  // const dataFiltered: UserProps[] = applyFilter({
  //   inputData: _users,
  //   comparator: getComparator(table.order, table.orderBy),
  //   filterName,
  // });
  const dataFiltered = tableData; // Just use the fetched data directly

  const notFound = !dataFiltered.length && !!filterName;
  
  if (isLoading) {
    return <DashboardContent><Typography>Loading table data...</Typography></DashboardContent>;
  }
  if (error) {
     return <DashboardContent><Typography>Error: {error}</Typography></DashboardContent>;
  }
  return (
    <DashboardContent>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={_users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _users.map((user) => user.id)
                  )
                }
                headLabel={[ // 8. Update Head Labels
                  { id: 'name', label: 'Name' },
                  { id: 'pnns', label: 'PNNS Group' },
                  { id: 'score', label: 'NutriScore' },
                  { id: 'brand', label: 'Brand' },
                  { id: 'categories', label: 'Categories' },
                  { id: '' }, // Keep for the menu button column
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
                      key={row.code}
                      row={{
                        code: row.code,
                        name: row.product_name || 'N/A',
                        pnns: row.pnns_groups_1 || 'N/A',
                        score: String(row.nutriscore_score ?? 'N/A'), // Ensure it's a string
                        brand: row.brands || 'N/A',
                        food_img: row.image_url || '', // Use image_url, provide default if needed
                        categories: row.categories || 'N/A',
                      }}
                      selected={table.selected.includes(row.code)}
                      onSelectRow={() => table.onSelectRow(row.code)}
                    />
                  ))}
{/* 
                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                /> */}

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={tableData.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
