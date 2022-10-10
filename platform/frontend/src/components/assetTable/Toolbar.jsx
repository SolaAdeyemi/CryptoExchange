import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const Toolbar = ({data, handleClick}) => {

   const rows = data

    return(
      <>
       <div>
          ...Markup
          <button onClick={handleClick}>Publish</button>
          {console.log(data[0])}
       </div>
       <div>
             <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell align="right">% change (24hrs)</TableCell>
              <TableCell align="right">Bid</TableCell>
              <TableCell align="right">Ask</TableCell>
              <TableCell align="right">Volume</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.pair}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.pair} 
                </TableCell>
                <TableCell align="right">{row.percent_change_24}</TableCell>
                <TableCell align="right">{row.bid}</TableCell>
                <TableCell align="right">{row.ask}</TableCell>
                <TableCell align="right">{row.volume}</TableCell>
                <button >Trade</button>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
      </>
    )
 }

 export default Toolbar