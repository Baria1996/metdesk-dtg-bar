import { Box } from "@mui/material";

export default function ForecastDTGs(props) {
  const { dtgs } = props;
  //   todo: state var for selected dtg to show its value in utc

  return (
    <>
      {dtgs.length > 0
        ? dtgs.map((dtg, id) => (
            <Box className="dtg-box" key={id}>
              {/* {dtg} */}
              {id}
            </Box>
          ))
        : ""}
    </>
  );
}
