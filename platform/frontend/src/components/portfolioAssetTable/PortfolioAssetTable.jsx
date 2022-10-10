import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Button } from "react-bootstrap";
import {
  getOpenOrders,
  cancelOpenOrder,
} from "../../features/orders/orderSlice";

const PortfolioAssetTable = ({ data, dispatch }) => {

  console.log("inside")
  console.log(data)

  const clicked = false

  const handleClick = (rowData, rowMeta) => {
    if (rowData.field == "Cancel") {
      console.log("Cancel");
      const id = rowData.id;
      dispatch(cancelOpenOrder({ id }));
    } else {
      console.log("not cnacel");
    }
    dispatch(getOpenOrders());
    clicked = true
    rows = [{open: 0, quantityFilled: 0, price: 123444, value: 0, symbol: "BTC/GBP"}]
  };
  
  const columns = [
    { field: "symbol", headerName: "Asset", width: 130 },
    { field: "quantityFilled", headerName: "Quantity Filled", width: 130 },
    { field: "open", headerName: "Open Quantity", type: "number", width: 130 },
    { field: "price", headerName: "Price", type: "number", width: 130 },
    { field: "value", headerName: "Value", type: "number", width: 90 },
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
  
  let rows = data;



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
            getRowId={(row) => row.symbol}
            onCellClick={handleClick}
          />
        </div>
      </div>
    </>
  );
};

export default PortfolioAssetTable;

// const PortfolioAssetTable = ({ data, handleClick }) => {
//   const rows = data;

//   return (
//     <>
//       <div>
//         <TableContainer component={Paper}>
//           <Table sx={{ minWidth: 650 }} aria-label="simple table">
//             <TableHead>
//               <TableRow>
//                 <TableCell align="right">Asset</TableCell>
//                 <TableCell align="right">Price</TableCell>
//                 <TableCell align="right">Total Value</TableCell>
//                 <TableCell align="right">Quantity Filled</TableCell>
//                 <TableCell align="right">Open order Quantity</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {rows.map((row) => (
//                 <TableRow
//                   key={row.pair}
//                   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//                 >
//                   <TableCell component="th" scope="row">
//                     {row.symbol}
//                   </TableCell>
//                   <TableCell align="right">{row.price}</TableCell>
//                   <TableCell align="right">{row.value}</TableCell>
//                   <TableCell align="right">{row.quantityFilled}</TableCell>
//                   <TableCell align="right">{row.open}</TableCell>

//                   <button>Trade</button>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </div>
//     </>
//   );
// };

// export default PortfolioAssetTable;
