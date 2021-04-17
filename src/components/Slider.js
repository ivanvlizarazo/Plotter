import React, { useState } from "react";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300 + theme.spacing(3) * 2,
  },
}));

const PrettoSlider = withStyles({
  root: {
    color: "#52af77",
    height: 8,
    alignContent: "center",
    alignItems: "center",
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

export default function CustomizedSlider() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);

  const handleSliderChange = (event, newValue) => {
    if (isNaN(min)) {
      setMin(0);
    }
    if (isNaN(max)) {
      setMax(100);
    }
    setValue(newValue);
  };

  function changeMin(e) {
    var number = parseInt(e.target.value);
    if (isNaN(number)) {
      setMin(number);
      setValue(0);
      if (max <= 0) {
        setMin(max - 100);
      }
    } else if (number < max || isNaN(max)) {
      setValue(number);
      setMin(number);
      if (number >= 100 &&  isNaN(max)) {
        setMax(number + 100);
      }
    }
  }
  function changeMax(e) {
    var number = parseInt(e.target.value);
    if (isNaN(number)) {
      setMax(number);
      setValue(0);
    } else if (number > min || isNaN(min)) {
      console.log("entra");
      setMax(number);
      if (value > number) {
        setValue(number);
      }
      if (number <= 0 &&  isNaN(min)) {
        setMin(number - 100);
      }
    }
  }

  return (
    <div className={classes.root}>
      <Typography gutterBottom>P = {value}</Typography>
      <PrettoSlider
        valueLabelDisplay="auto"
        aria-label="pretto slider"
        defaultValue={value}
        value={value}
        onChange={handleSliderChange}
        min={isNaN(min) ? 0 : min}
        max={isNaN(max) ? 100 : max}
      />

      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={2}>
          <TextField
            id="standard-number"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={min}
            onChange={(e) => changeMin(e)}
          />
        </Grid>
        <Grid item xs={4}>
          {" <= "} P {" <= "}
        </Grid>
        <Grid item xs={2}>
          <TextField
            id="standard-number2"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={max}
            onChange={(e) => changeMax(e)}
          />
        </Grid>
      </Grid>
    </div>
  );
}