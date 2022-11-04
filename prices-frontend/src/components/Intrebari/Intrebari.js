import "./Intrebari.css";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import location_area_arr from "./Data/location_area";
import TextFieldNumeric from "./formComponents/textFieldNumeric";

import React from "react";
//categorical_features = ['location_area', 'partitioning','comfort','real_estate_type','height_regime','level']
//location,subway_dist,partitioning,comfort,furnished,heater_owner,rooms_count,useful_surface,built_surface,construction_year,real_estate_type,height_regime,level,max_level,kitchens_count,bathrooms_count,garages_count,parking_lots_count,balconies_count

//TODO : Daca real_estate_type = casa/vila, atunci etaj = max_level
//TODO : height_regime este dedus din max_level (lipsesc 18 si 24 sau ceva de genu, mai verifica pe notebook)
//TODO : daca furnished = 0, atunci comfort = 0
//TODO : built_surface = useful_surface + 25%

export default function Intrebari(props) {
  const [imobiliar, setImobiliar] = React.useState({
    location_area: "",
    subway_dist: null,
    partitioning: "",
    comfort: "0",
    furnished: 0,
    heater_owner: 0,
    rooms_count: 0,
    useful_surface: 0,
    built_surface: 0,
    construction_year: null,
    real_estate_type: "",
    height_regime: "",
    level: "",
    max_level: null,
    kitchens_count: 0,
    bathrooms_count: 0,
    garages_count: false,
    parking_lots_count: false,
    balconies_count: 0,
  });
  const handleChange = (event) => {
    const fieldName = event.target.name;
    let fieldVal;
    if (
      fieldName === "parking_lots_count" ||
      fieldName === "garages_count" ||
      fieldName === "heater_owner" ||
      fieldName === "furnished"
    ) {
      fieldVal = event.target.checked;
    } else {
      fieldVal = event.target.value;
    }
    setImobiliar((prevImob) => {
      let newImob;

      newImob = { ...prevImob };
      newImob[fieldName] = fieldVal;
      return newImob;
    });
  };

  const submitImobiliar = async (event) => {
    event.preventDefault();
    let params = "?";
    if (imobiliar["real_estate_type"] === "casa/vila") {
      imobiliar["level"] = imobiliar["max_level"];
    }
    if (
      imobiliar["max_level"].toString() === "18" ||
      imobiliar["max_level"].toString() === "24"
    ) {
      imobiliar["height_regime"] =
        "P+" + (imobiliar["max_level"] - 1).toString() + "E";
    } else {
      imobiliar["height_regime"] =
        "P+" + imobiliar["max_level"].toString() + "E";
    }

    if (imobiliar["furnished"] === false) {
      imobiliar["comfort"] = 0;
    }

    imobiliar["built_surface"] =
      parseInt(imobiliar["useful_surface"]) +
      Math.floor((parseInt(imobiliar["useful_surface"]) * 30) / 100);

    for (var field in imobiliar) {
      if (imobiliar[field] === false) {
        imobiliar[field] = 0;
      } else if (imobiliar[field] === true) {
        imobiliar[field] = 1;
      }
      if (field !== "location_area") {
        params = params.concat("&" + field + "=");
      } else {
        params = params.concat(field + "=");
      }
      params = params.concat(imobiliar[field].toString());
    }
    console.log(params);
    const res = await fetch(`http://localhost:5000/get_price${params}`);
    const json = await res.json();
    props.setPrice(Math.floor(json));
  };

  return (
    <section className="intrebariContainer">
      <form className="formContainer">
        <div className="buttonContainer">
          <Button
            variant="contained"
            sx={{
              fontSize: "1.5rem",
              backgroundColor: "white",
              color: "#161616",
              "&:hover": {
                backgroundColor: "#a9a9a9",
              },
            }}
            onClick={submitImobiliar}
          >
            Calculeaza
          </Button>
        </div>
        <Accordion sx={{ width: 400 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{ boxShadow: "inset 0px -2px 1px gray" }}
          >
            Locatia Imobiliarului
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <FormControl variant="standard" fullwidth>
                <InputLabel id="labelArea">Zona</InputLabel>
                <Select
                  MenuProps={{ disableScrollLock: true }}
                  required
                  labelId="labelArea"
                  id="selectArea"
                  value={imobiliar["location_area"]}
                  onChange={handleChange}
                  sx={{ width: 120 }}
                  name="location_area"
                >
                  {location_area_arr.sort().map((location) => {
                    return <MenuItem value={location}>{location}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </div>

            <div className="accordionChild">
              <FormControl variant="standard" fullwidth>
                <InputLabel id="labelType">Tipul Imobiliarului</InputLabel>
                <Select
                  MenuProps={{ disableScrollLock: true }}
                  required
                  labelId="labelType"
                  id="selectType"
                  value={imobiliar["real_estate_type"]}
                  onChange={handleChange}
                  sx={{ width: 200 }}
                  name="real_estate_type"
                >
                  {["bloc de apartamente", "casa/vila"].map((el) => {
                    return <MenuItem value={el}>{el}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </div>
            <TextFieldNumeric
              catName="subway_dist"
              labelName="Distanta de metrou"
              meters={true}
              imobiliar={imobiliar}
              handleChange={handleChange}
            />
            <TextFieldNumeric
              catName="construction_year"
              labelName="Anul constructiei"
              imobiliar={imobiliar}
              handleChange={handleChange}
            />
            <TextFieldNumeric
              catName="max_level"
              labelName="Numar etaje"
              imobiliar={imobiliar}
              handleChange={handleChange}
            />
            <div className="accordionChild">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="parking_lots_count"
                      color="default"
                      checked={imobiliar["parking_lots_count"]}
                      onChange={handleChange}
                    />
                  }
                  label="Loc de parcare"
                />
              </FormGroup>
            </div>
            <div className="accordionChild">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="garages_count"
                      color="default"
                      checked={imobiliar["garages_count"]}
                      onChange={handleChange}
                    />
                  }
                  label="Garaj"
                />
              </FormGroup>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{ boxShadow: "inset 0px -2px 1px gray" }}
          >
            Interiorul Imobiliarului
          </AccordionSummary>
          <AccordionDetails>
            <TextFieldNumeric
              catName="rooms_count"
              labelName="Numar de Camere"
              imobiliar={imobiliar}
              handleChange={handleChange}
            />
            <TextFieldNumeric
              catName="useful_surface"
              labelName="Suprafata utila"
              imobiliar={imobiliar}
              handleChange={handleChange}
              meters={true}
            />
            <TextFieldNumeric
              catName="level"
              labelName="Etaj"
              imobiliar={imobiliar}
              handleChange={handleChange}
            />
            <TextFieldNumeric
              catName="kitchens_count"
              labelName="Numar bucatarii"
              imobiliar={imobiliar}
              handleChange={handleChange}
            />
            <TextFieldNumeric
              catName="bathrooms_count"
              labelName="Numar bai"
              imobiliar={imobiliar}
              handleChange={handleChange}
            />
            <TextFieldNumeric
              catName="balconies_count"
              labelName="Numar balcoane"
              imobiliar={imobiliar}
              handleChange={handleChange}
            />
            <div className="accordionChild">
              <FormControl variant="standard" fullwidth>
                <InputLabel id="labelType">Partitionare</InputLabel>
                <Select
                  required
                  labelId="labelType"
                  id="selectType"
                  value={imobiliar["partitioning"]}
                  onChange={handleChange}
                  sx={{ width: 200 }}
                  name="partitioning"
                  MenuProps={{ disableScrollLock: true }}
                >
                  {[
                    "decomendat",
                    "semidecomandat",
                    "circular",
                    "nedecomandat",
                    "vagon",
                  ].map((el) => {
                    return <MenuItem value={el}>{el}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="accordionChild">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="furnished"
                      color="default"
                      checked={imobiliar["furnished"]}
                      onChange={handleChange}
                    />
                  }
                  label="Mobilat?"
                />
              </FormGroup>
            </div>
            <div className="accordionChild">
              <FormControl
                variant="standard"
                disabled={!imobiliar["furnished"]}
                fullwidth
              >
                <InputLabel id="labelType">Nivel de Comfort</InputLabel>
                <Select
                  MenuProps={{ disableScrollLock: true }}
                  required
                  labelId="labelType"
                  id="selectType"
                  value={imobiliar["comfort"]}
                  onChange={handleChange}
                  sx={{ width: 200 }}
                  name="comfort"
                >
                  {["0", "1", "2", "3", "lux"].map((el) => {
                    return <MenuItem value={el}>{el}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="accordionChild">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="heater_owner"
                      color="default"
                      checked={imobiliar["heater_owner"]}
                      onChange={handleChange}
                    />
                  }
                  label="Centrala"
                />
              </FormGroup>
            </div>
          </AccordionDetails>
        </Accordion>
      </form>
    </section>
  );
}
