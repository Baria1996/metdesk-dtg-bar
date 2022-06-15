import * as React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import axios from "axios";
import TabPanel from "./components/TabPanel";

export default function BasicTabs() {
  const [tabValue, setTabValue] = React.useState(0);
  const [issues, setIssues] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(
        `https://api-staging.metdesk.com/get/metdesk/powergen/v2/issues?model=ecop`,
        {
          headers: {
            Authorization: process.env.REACT_APP_POWERGEN_API_KEY,
          },
        }
      )
      .then((res) => {
        let reversedIssuesArray = res.data.data.reverse();
        setIssues(reversedIssuesArray);
      })
      .catch((e) => console.log(e));
  }, []);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100" }}>
      <Box sx={{ borderBottom: 0 }}>
        <Tabs
          className="issues-container"
          value={tabValue}
          onChange={handleChange}
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons={false}
          aria-label="dtgTabs"
        >
          {issues.length > 0 ? (
            issues.map((issue, id) => <Tab label={issue} key={id} />)
          ) : (
            <Tab label="-" />
          )}
        </Tabs>
      </Box>

      {issues.length > 0 ? (
        issues.map((issue, id) => (
          <TabPanel value={tabValue} index={id} key={id}>
            {issue} - {id}
          </TabPanel>
        ))
      ) : (
        <>
          <TabPanel value={tabValue} index={0}>
            No issue selected
          </TabPanel>
        </>
      )}
    </Box>
  );
}
