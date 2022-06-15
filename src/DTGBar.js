import * as React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import axios from "axios";
import TabPanel from "./components/TabPanel";
import moment from "moment";
import ForecastDTGs from "./components/ForecastDTGs";

export default function BasicTabs() {
  // todo: latet issue hightlight
  const [tabValue, setTabValue] = React.useState(0); // value of the selected tab panel
  const [issues, setIssues] = React.useState([]); // array of issues for the selected model 'ecop'
  const [dtgs, setDtgs] = React.useState([]); // array of dtgs for the selected issue

  // async function to get all issues for the model 'ecop' and dtgs for the very first issue
  const getIssues = async () => {
    try {
      const issuesResponse = await axios.get(
        `https://api-staging.metdesk.com/get/metdesk/powergen/v2/issues?model=ecop`,
        {
          headers: {
            Authorization: process.env.REACT_APP_POWERGEN_API_KEY,
          },
        }
      );
      const reversedIssuesArray = issuesResponse.data.data.reverse();
      setIssues(reversedIssuesArray);
      await getDTGs(reversedIssuesArray[0]);
    } catch (e) {
      console.log(e);
      setIssues([]);
      setDtgs([]);
    }
  };

  // async function to get the forecast DTGs for a selected issue
  const getDTGs = async (selectedIssue) => {
    try {
      const dtgsResponse = await axios.get(
        `https://api-staging.metdesk.com/get/metdesk/powergen/v2/dtgs?model=ecop&element=combined&interval=model&issue=${selectedIssue}`,
        {
          headers: {
            Authorization: process.env.REACT_APP_POWERGEN_API_KEY,
          },
        }
      );
      const reversedDtgsArray = dtgsResponse.data.data.reverse();
      setDtgs(reversedDtgsArray);
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    getIssues();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    getDTGs(issues[newValue]);
  };

  return (
    <Box sx={{ width: "100" }}>
      <Box sx={{ borderBottom: 0 }}>
        <Tabs
          className="issues-container"
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons={false}
          aria-label="dtgTabs"
        >
          {issues.length > 0 ? (
            issues.map((issue, id) => (
              <Tab
                label={moment(issue).utc().format("DD/MM/YYYY - HH:mm:ss")}
                key={id}
              />
            ))
          ) : (
            <Tab label="-" />
          )}
        </Tabs>
      </Box>

      {issues.length > 0 ? (
        issues.map((issue, id) => (
          <TabPanel value={tabValue} index={id} key={id}>
            {dtgs.length > 0 ? (
              <ForecastDTGs dtgs={dtgs} />
            ) : (
              <span>No DTGs available</span>
            )}
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
