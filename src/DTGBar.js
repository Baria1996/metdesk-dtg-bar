import * as React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import axios from "axios";
import TabPanel from "./components/TabPanel";
import moment from "moment";
import ForecastDTGs from "./components/ForecastDTGs";

export default function BasicTabs() {
  const [tabValue, setTabValue] = React.useState(0); // value of the selected tab panel
  const [issues, setIssues] = React.useState([]); // array of issues for the selected model
  const [dtgs, setDtgs] = React.useState([]); // array of dtgs for the selected issue
  const [model, setModel] = React.useState("ecop"); // selected model

  // async function to get all issues for the selected model and dtgs for the very first issue
  const getIssues = async () => {
    try {
      const issuesResponse = await axios.get(
        `https://api-staging.metdesk.com/get/metdesk/powergen/v2/issues?model=${model}`,
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
        `https://api-staging.metdesk.com/get/metdesk/powergen/v2/dtgs?model=${model}&element=combined&interval=model&issue=${selectedIssue}`,
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
  }, [model]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    getDTGs(issues[newValue]);
  };

  //   only show midnight issues -> filter array to show only the issues where time is 00:00:00
  const midnightIssues = () => {
    const midnightIssues = issues.filter((issue) => {
      let dt = moment(issue).utc();
      return dt.hours() === 0 && dt.minutes() === 0 && dt.seconds() === 0;
    });
    setIssues(midnightIssues);
  };

  // set selected model
  const changeModel = (e) => {
    setModel(e.target.value);
  };

  const latestIssue = () => {
    setTabValue(0);
  };

  return (
    <Box sx={{ width: "100" }}>
      <select className="filter-button" onChange={changeModel} value={model}>
        <option hidden value="ecop">
          Model - ecop
        </option>
        <option value="ecop">ecop</option>
        <option value="eceps">eceps</option>
        <option value="gfsop">gfsop</option>
        <option value="gfsens">gfsens</option>
        <option value="uke4">uke4</option>
        <option value="icon">icon</option>
        <option value="arpege">arpege</option>
      </select>
      <button className="filter-button" onClick={midnightIssues}>
        Midnight Issues Only
      </button>
      <button className="help-button" onClick={latestIssue}>
        Go to Latest Isssue
      </button>
      <br />
      <Box sx={{ borderBottom: 0, mt: 4 }}>
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
            issues.map((issue, id) =>
              id === 0 ? (
                <Tab className="issue-button" label="Latest Issue" key={id} />
              ) : (
                <Tab
                  className="issue-button"
                  label={moment(issue).utc().format("DD/MM/YYYY - HH:mm:ss")}
                  key={id}
                />
              )
            )
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
