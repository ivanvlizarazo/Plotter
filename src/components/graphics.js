import React, { useState, useEffect } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Avatar,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DeleteIcon from "@material-ui/icons/Delete";
import CustomizedSlider from "./Slider";
import { Alert, AlertTitle } from "@material-ui/lab";
Highcharts.setOptions({
  lang: { resetZoom: "Restablecer zoom", resetZoomTitle: "Restablecer zoom" },
});

const drawerWidth = 380;
const palette = [
  "#FB5012",
  "#00EAE4",
  "#3A1772",
  "#E9DF00",
  "#D61F34",
  "#FFD275",
  "#0CCE6B",
  "#8A4F7D",
  "#F962A6",
  "#BBAB8B",
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    background: "#00f0",
  },
  buttonAdd: {
    margin: "15px 0 50px 0 ",
  },
  formControl: {
    minWidth: 55,
  },
  input: {
    "& .MuiInputBase-input": {
      textAlign: "end",
    },
  },
  drawer: {
    width: drawerWidth,
    marginBottom: "15px",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  drawerPaper: {
    width: drawerWidth,
    boxShadow: "2px 0px 8px 0px lightgrey",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  menuButton: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  hide: {
    display: "none",
  },
  closeIcon: {
    color: theme.palette.primary.main,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: "14px",
  },
}));

export default function Graphic() {
  const classes = useStyles();
  const [P, setP] = useState(0);
  const [X, setX] = useState();
  const [Y, setY] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([
    { x_coef: "", y_coef: "", const: "", symbol: "<=" },
  ]);

  const [options, setOptions] = useState({
    chart: {
      zoomType: "xy",
      panning: {
        enabled: true,
        type: "xy",
      },
      panKey: "shift",
    },
    navigation: {
      menuStyle: {
        background: "#E0E0E0",
      },
    },
    exporting: true,
    xAxis: {
      gridLineWidth: 1,
      gridZIndex: -9,
      gridLineColor: "#999",
    },
    yAxis: {
      gridLineColor: "#999",
      gridZIndex: -9,
      title: {
        text: "Valores",
      },
    },
    tooltip: {
      formatter: function () {
        return "(<b>" + this.x + "</b>,<b>" + this.y + ")</b>";
      },
    },
    title: null,
    series: [],
    credits: false,
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
    },
  });

  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function onChange(e, index) {
    var state = [...data];
    var copySeries = [...options.series];
    state[index] = { ...state[index], [e.target.name]: e.target.value };
    setData(state);
    const copy = {
      name: `Inecuación ${index + 1}`,
      color: palette[index % 10],
      fillOpacity: 0.2,
      type: "area",
      data: Line(
        parseInt(state[index].x_coef),
        parseInt(state[index].y_coef),
        parseInt(state[index].const)
      ),
      threshold:
        state[index].symbol === ">" || state[index].symbol === ">="
          ? Infinity
          : -Infinity,
      dashStyle:
        state[index].symbol === ">" || state[index].symbol === "<"
          ? "longdash"
          : "solid",
    };

    if (copySeries.length === index) {
      copySeries.push(copy);
    } else {
      copySeries[index] = copy;
    }

    setOptions({
      ...options,
      series: copySeries,
    });
  }

  function point(a, b, c) {
    return (c - a) / b;
  }

  function Line(a, b, c) {
    var line = [];
    for (var i = -50; i <= 50; i++) {
      line.push(point(a * i, b, c));
    }
    return line;
  }

  const disableButton = () => {
    var isOK = true;
    for (let [key, value] of Object.entries(data)) {
      if (value.x_coef === "" || value.y_coef === "" || value.const === "") {
        isOK = false;
      }
    }

    return isOK;
  };

  function addRow() {
    setData([...data, { x_coef: "", y_coef: "", const: "", symbol: "<=" }]);
  }

  function getPValue(value) {
    setP(value);
  }

  function deleteFunction(e, index) {
    var copySeries = [...options.series];
    var state = [...data];

    copySeries.splice(index, 1);

    if (state.length === 1) {
      setData([{ x_coef: "", y_coef: "", const: "", symbol: "<=" }]);
    } else {
      state.splice(index, 1);
      for (let [key, value] of Object.entries(copySeries)) {
        var copyValue = { ...value };
        if (copyValue["color"] !== "#000") {
          
          copyValue["color"] = palette[parseInt(key % 10)];
          copyValue["name"] = `Función ${parseInt(key) + 1}`;
        }
        copySeries[parseInt(key)] = copyValue;
        
      }
      setData(state);
    }
    setOptions({
      ...options,
      chart: {
        zoomType: "xy",
      },
      series: copySeries,
    });
  }

  useEffect(() => {
    // setTarget(Line(X, Y, P));
    if (X !== undefined && Y !== undefined) {
      var copySeries = [...options.series];
      var FO = false;
      var indexFO = null;
      for (let [key, value] of Object.entries(copySeries)) {
        if (value.name === "Función objetivo") {
          FO = true;
          indexFO = parseInt(key);
        }
      }

      const copy = {
        name: `Función objetivo`,
        color: "#000",
        data: Line(X, Y, P),
        type: "line",
        dashStyle:'Solid'
      };

      if (!FO) {
        copySeries.push(copy);
      } else {
        copySeries[indexFO] = copy;
      }
      setOptions({
        ...options,

        series: copySeries,
      });
    }
  }, [X, Y, P,data]);

  return (
    <div className={classes.root}>
      <Grid container direction="row">
        <div>
          <Tooltip title="Mostrar menú" placement="right">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <ChevronRightIcon />
            </IconButton>
          </Tooltip>
        </div>
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
            <Tooltip title="Ocultar menú" placement="right">
              <IconButton
                onClick={handleDrawerClose}
                className={classes.closeIcon}
              >
                <ChevronLeftIcon />
              </IconButton>
            </Tooltip>
          </div>
          <Grid
            container
            item
            direction="column"
            xs={11}
            alignItems="center"
            style={{ paddingBottom: "20px" }}
          >
            {data.map((equation, index) => (
              <Grid
                container
                item
                direction="row"
                justify="space-evenly"
                alignItems="center"
                key={index}
              >
                <Grid item>
                  <Avatar
                    className={classes.small}
                    style={{ background: palette[index % 10] }}
                  >
                    {index + 1}
                  </Avatar>
                </Grid>
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
                <Grid item xs={1}>
                  <Tooltip title="Eliminar inecuación" placement="right">
                    <IconButton
                      color="secondary"
                      onClick={(e) => deleteFunction(e, index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            ))}
            <Grid item>
              <Button
                className={classes.buttonAdd}
                onClick={addRow}
                color="primary"
                disabled={disableButton() !== true}
              >
                <AddIcon /> Añadir inecuación
              </Button>
            </Grid>
            <Divider />
            <Grid item>
              <h4>Función objetivo:</h4>
            </Grid>
            <Grid
              container
              item
              direction="row"
              justify="space-evenly"
              alignItems="center"
            >
              <Grid item xs={2}>
                <TextField
                  className={classes.input}
                  fullWidth
                  id="X"
                  name="const"
                  onChange={(e) => setX(parseInt(e.target.value))}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">X</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  className={classes.input}
                  fullWidth
                  id="Y"
                  name="const"
                  onChange={(e) => setY(parseInt(e.target.value))}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">Y</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <span> = P</span>
              </Grid>
            </Grid>

            <CustomizedSlider getPValue={getPValue} />
          </Grid>
        </Drawer>
        <Grid
          container
          item
          direction="column"
          xs={12}
          sm={12}
          md={8}
          lg={8}
          xl={8}
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <HighchartsReact highcharts={Highcharts} options={options} />{" "}
          <Alert severity="info">
            <AlertTitle>Ayuda</AlertTitle>
            Zoom: haz clic y arrastra para seleccionar el área en la que deseas
            hacer zoom
            <br />
            Mover: presiona Shift mientras haces clic para desplazarte por la
            gráfica
          </Alert>
        </Grid>
      </Grid>
    </div>
  );
}
