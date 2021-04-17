import React, { useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import clsx from 'clsx';

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Grid, IconButton, InputAdornment } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Drawer from "@material-ui/core/Drawer";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const drawerWidth = 460;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  formControl: {
    minWidth: 65,
  },
  input: {
    "& .MuiInputBase-input": {
      textAlign: "end",
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  menuButton: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
    background: theme.palette.primary.main,
    color: "#fff"
  },
  hide: {
    display: 'none',
  },
}));

export default function Graphic() {
  const classes = useStyles();
  const [data, setData] = useState([
    { x_coef: "", y_coef: "", const: "", symbol: "<=" },
  ]);

  const [options, setOptions] = useState({
    chart: {
      type: "area",
    },
    title: {
      text: "My chart",
    },
    series: [
      {
        data: [{}],
      },
    ],
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
    },
  });

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function onChange(e, index) {
    var state = [...data];
    state[index] = { ...state[index], [e.target.name]: e.target.value };
    setData(state);
  }

  function onClick(idx) {
    setOptions({
      ...options,
      series: [
        {
          data: Line(
            parseInt(data[idx].x_coef),
            parseInt(data[idx].y_coef),
            parseInt(data[idx].const)
          ),
          // threshold: fill === "Infinity" ? Infinity : -Infinity,
        },
      ],
    });
  }

  function point(a, b, c) {
    return (c - a) / b;
  }

  function Line(a, b, c) {
    var line = [];
    for (var i = 0; i <= 60; i++) {
      line.push(point(a * i, b, c));
    }
    return line;
  }

  function addRow() {
    setData([...data, { x_coef: "", y_coef: "", const: "", symbol: "<=" }]);
  }

  return (
    <div className={classes.root}>
      <Grid container direction="row" spacing={2}>
        <div >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, open && classes.hide)}
        >
          <ChevronRightIcon />
        </IconButton></div>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose} className={classes.menuButton}>
                <ChevronLeftIcon />
            </IconButton>
          </div>
          <Grid
            container
            item
            direction="column"
            xs={11}
            
            alignItems="center"
          >
            {data.map((equation, index) => (
              <Grid
                container
                item
                direction="row"
                spacing={2}
                justify="center"
                alignItems="center"
              >
                <Grid item xs={2}>
                  <TextField
                    className={classes.input}
                    fullWidth
                    id="x"
                    name="x_coef"
                    onChange={(e) => onChange(e, index)}
                    type="number"
                    value={equation.x_coef}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">x</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    className={classes.input}
                    fullWidth
                    id="y"
                    name="y_coef"
                    onChange={(e) => onChange(e, index)}
                    type="number"
                    value={equation.y_coef}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">y</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormControl className={classes.formControl}>
                    <Select
                      fullWidth
                      id="constant"
                      // label="Inecuación"
                      name="symbol"
                      style={{ textAlign: "center" }}
                      onChange={(e) => onChange(e, index)}
                      value={equation.symbol}
                    >
                      <MenuItem value={">="}>{`>=`}</MenuItem>
                      <MenuItem value={"<="}>{`<=`}</MenuItem>
                      <MenuItem value={">"}> {">"}</MenuItem>
                      <MenuItem value={"<"}>{"<"}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    className={classes.input}
                    fullWidth
                    id="b"
                    name="const"
                    onChange={(e) => onChange(e, index)}
                    type="number"
                    value={equation.const}
                  />
                </Grid>
                <Grid item xs={2}>
                  <button onClick={() => onClick(index)}> cargar </button>
                </Grid>
              </Grid>
            ))}
            <Grid item>
              <IconButton onClick={addRow} color="primary">
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Drawer>
        <Grid
          container
          item
          direction="column"
          xs={12}
          sm={12}
          md={6}
          lg={6}
          xl={6}
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <HighchartsReact highcharts={Highcharts} options={options} />{" "}
        </Grid>
      </Grid>
    </div>
  );
}