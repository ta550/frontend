import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import EnhancedTableToolbar from './EnhancedTableToolbar'
import { useSelector } from 'react-redux'


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'system', numeric: false, disablePadding: true, label: 'System' },
  { id: 'board', numeric: false, disablePadding: false, label: 'Board' },
  { id: 'subject', numeric: false, disablePadding: false, label: 'Subject' },
  { id: 'year', numeric: false, disablePadding: false, label: 'Year' },
  { id: 'month', numeric: false, disablePadding: false, label: 'Month' },
  { id: 'series', numeric: false, disablePadding: false, label: 'Series' },
  { id: 'paper', numeric: false, disablePadding: false, label: 'Paper' }
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function AdminPapersComponent() {
  const classes = useStyles();
  const [rows, setRows] = React.useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [id, setId] = React.useState([])
  const loginReducer = useSelector(state => state.loginReducer)
  const [getData, setGetData] = React.useState("")
  const [progressBarStatus, setProgressBarStatus] = React.useState("")





  React.useEffect(() => {
    setId([])
    setSelected([])
    setProgressBarStatus('')
    fetch("/dashboard/de/metadata", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginReducer}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.message) {
          setRows([])
          setSelected([])
        } else { 
          setProgressBarStatus('d-none')
          setRows(res)
        }
      })
      .catch(err => console.log(err))
  }, [getData])



  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n, index) => index);
      setSelected(newSelecteds);
      const newId = rows.map((n, index) => n.id)
      setId(newId)
      return;
    }
    setId([])
    setSelected([]);
  };

  const handleClick = (event, index, id2) => {
    const selectedIndex = selected.indexOf(index);
    const selectedId = id.indexOf(id2)
    let newSelected = [];
    let newId = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, index);
      newId = newId.concat(id, id2);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newId = newId.concat(id.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newId = newId.concat(id.slice(0, -1));
    } else if (selectedIndex > 0) {
      newId = newId.concat(
        id.slice(0, selectedId),
        id.slice(selectedId + 1)
      )
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setId(newId)
    setSelected(newSelected);
  };

  const callUseEffect = () => {
    if (!getData) {
      setGetData(true)
    } else {
      setGetData(false)
    }
  }


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelected([])
    setId([])
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={`${classes.root} container d-flex align-items-center flex-column mt-5`}>
      <Paper className={`${classes.paper} `}>
        <EnhancedTableToolbar data={rows} progressBarStatus={progressBarStatus} id={id} selected={selected} callUseEffect={callUseEffect} />
        <TableContainer style={{ boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)" }}>
          <Table
            className={`${classes.table} mb-3 text-white`}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(index);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, index, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.system}
                      </TableCell>
                      <TableCell align="left">{row.board}</TableCell>
                      <TableCell align="left">{row.subject}</TableCell>
                      <TableCell align="left">{row.year}</TableCell>
                      <TableCell align="left">{row.month}</TableCell>
                      <TableCell align="left">{row.series}</TableCell>
                      <TableCell align="left">{row.paper}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          style={{ border: 'none' }}
          rowsPerPageOptions={[5, 10, 15, 20, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <FormControlLabel
        control={<Switch color="primary" checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </div>
  );
}