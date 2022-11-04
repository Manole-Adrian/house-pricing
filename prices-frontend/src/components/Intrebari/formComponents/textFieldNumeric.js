import React from "react";
import TextField from "@mui/material/TextField";
import isNumeric from "../../../utils/isNumeric";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";

export default function TextFieldNumeric(props) {
  return (
    <div className="accordionChild">
      <FormControl fullwidth>
        <TextField
          error={
            isNumeric(props.imobiliar[props.catName]) === false &&
            props.imobiliar[props.catName] !== null
          }
          id={props.catName}
          label={props.labelName}
          name={props.catName}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={props.handleChange}
          value={props.imobiliar[props.catName]}
          variant="standard"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {props.meters === true ? "m" : ""}
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
    </div>
  );
}


