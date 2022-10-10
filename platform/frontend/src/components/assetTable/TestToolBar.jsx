import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Navigate, useNavigate } from 'react-router-dom'

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const columns = [
  { field: 'pair', headerName: 'Asset', width: 130 },
  { field: 'percent_change_24', headerName: '% Change',description: 'The percent change over the last 24 hours', width: 130 },
  { field: 'bid', headerName: 'Bid', type: 'number', width: 130 },
  { field: 'ask', headerName: 'Ask', type: 'number', width: 90 },
  { field: 'volume', headerName: 'Volume', type: 'number', width: 90 },
];

const Toolbar = ({data}) => {

   const rows = data
   const navigate = useNavigate()

   const handleClick = (rowData, rowMeta) => {
    let newPath = `/trade/` + rowData.id
    navigate(newPath)
   };

    return(
      <>
       <div>
        <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.pair}
          onRowClick={handleClick}
        />
      </div>
      </div>
      </>
    )
 }

 export default Toolbar