import React from "react";
import moment from "moment";
import { Box } from "@mui/material";

export default function ForecastDTGs(props) {
  const { dtgs } = props;
  const [selectedDtg, setSelectedDtg] = React.useState("");
  const [selectedDtgIndex, setSelectedDtgIndex] = React.useState(0);
  //  by default, the first dtg is selected and displayed as text string
  React.useEffect(() => {
    setSelectedDtg(dtgs[0]);
  }, []);

  return (
    <>
      {dtgs.length > 0
        ? dtgs.map((dtg, id) => (
            <Box
              className={
                id === selectedDtgIndex ? "dtg-box selected" : "dtg-box"
              }
              key={id}
              onClick={() => {
                setSelectedDtg(dtg);
                setSelectedDtgIndex(id);
              }}
            >
              {id}
            </Box>
          ))
        : ""}
      <Box className="selected-dtg-box">
        {moment(selectedDtg).utc().format("DD/MM/YYYY - HH:mm:ss")}
      </Box>
    </>
  );
}
