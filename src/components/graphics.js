import React, { useState, useEffect } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { makeStyles } from "@material-ui/core/styles";
const math = require("mathjs");

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    minWidth: 120,
    alignSelf: "center",
  },
  formControl: {
   
    minWidth: 120,
  },
}));

export default function Graphic() {
  const classes = useStyles();
  const [A, setA] = useState("");
  const [B, setB] = useState("");
  const [C, setC] = useState("");
  const [result, setResult] = useState();
  const [fill, setFill] = useState();

  const [options, setOptions] = useState({
    chart: {
      type: "area",
    },
    title: {
      text: "My chart",
    },
    series: [
      {
        data: [],
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

  function onChangeA(e) {
    setA(e.target.value);
  }
  function onChangeB(e) {
    setB(e.target.value);
  }
  function onChangeC(e) {
    setC(e.target.value);
  }
  function onChangeFill(e) {
    setFill(e.target.value);
  }

  function onClick() {
    setResult(math.evaluate(A));
    setOptions({
      ...options,
      series: [
        {
          data: Line(parseInt(A), parseInt(B), parseInt(C)),
          threshold: fill === "Infinity" ? Infinity : -Infinity,
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

  return (
    <div style={{ marginTop: "50px" }}>
    
        X:
        <TextField
          id="outlined-basic"
          onChange={(e) => onChangeA(e)}
          label="X"
          variant="outlined"
        />
        Y:
        <TextField
          id="outlined-basic"
          onChange={(e) => onChangeB(e)}
          label="Y"
          variant="outlined"
        />
        Fill:{" "}
        <FormControl variant="outlined" className={classes.formControl} >
          <InputLabel id="demo-simple-select-outlined-label">Inecuación</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            onChange={(e) => onChangeFill(e)}
            label="Inecuación"
          >
            <MenuItem value={'>='}> mayor o igual</MenuItem>
            <MenuItem value={'<='}>menor o igual</MenuItem>
            <MenuItem value={'>'}> mayor</MenuItem>
            <MenuItem value={'<'}>menor</MenuItem>
          </Select>
        </FormControl>
        C:
        <TextField
          id="outlined-basic"
          onChange={(e) => onChangeC(e)}
          label="Constante"
          variant="outlined"
        />
        <div> {result} </div>
        <button onClick={onClick}> cargar </button>{" "}
        <HighchartsReact highcharts={Highcharts} options={options} />{" "}
     <div>{A}X{B}Y{fill}{C}</div>
    </div>
  );
}
