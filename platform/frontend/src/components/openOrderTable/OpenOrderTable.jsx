import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Button } from "react-bootstrap";
import {
  getOpenOrders,
  cancelOpenOrder,
} from "../../features/orders/orderSlice";

const OpenOrderTable = ({ data, dispatch }) => {

  const handleClick = (rowData, rowMeta) => {
    if (rowData.field == "Cancel") {
      console.log("Cancel");
      const id = rowData.id;
      dispatch(cancelOpenOrder({ id }));
    } else {
      console.log("not cnacel");
    }
    dispatch(getOpenOrders());
  };

  const columns = [
    { field: "symbol", headerName: "Asset", width: 130 },
    { field: "limitPrice", headerName: "Limit Price", width: 130 },
    { field: "side", headerName: "Order Side", type: "number", width: 130 },
    { field: "quantity", headerName: "Quantity", type: "number", width: 90 },
    {
      field: "Cancel",
      renderCell: (cellValues) => {
        return (
          <Button
            color="blue"
            variant="contained"
          >
            Cancel
          </Button>
        );
      },
    },
  ];

  const rows = data;
  //  const rows = [{symbol: 'BTC/GBP', quantity: 10, side: 'BUY', limitPrice: 10, id: '6333b8348e511d27b180c92c'},
  //  {symbol: 'BTC/GBP', quantity: 10, side: 'BUY', limitPrice: 10, id: '6333b8348e511d27b180c927'},
  //  {symbol: 'BTC/GBP', quantity: 10, side: 'BUY', limitPrice: 10, id: '6333b8348e511d27b180c8'}]
  console.log("Type of rows: " + typeof data);
  return (
    <>
      <div>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row.id}
            onCellClick={handleClick}
          />
        </div>
      </div>
    </>
  );
};

export default OpenOrderTable;
