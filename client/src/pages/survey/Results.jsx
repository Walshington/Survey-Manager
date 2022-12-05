import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../util/AuthProvider";
import { Container, Grid, Paper, Box, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.primary,
}));

function Results() {
  const [surv, setSurvey] = useState([]);
  const param = useParams();
  const user = useAuth();

  useEffect(() => {
    const getUsers = async () => {
      const body = {
        surveyID: param.id,
      };
      try {
        const result = await axios.post(
          "http://127.0.0.1:7777/getsurvey",
          body
        );
        setSurvey(result.data[0]);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, [param.id]);

  async function SaveSurveyResults(json) {
    const body = {
      response: json,
      email: user.user.email,
      surveyID: surv.id,
      dateSubmitted: new Date().toISOString().slice(0, 10),
    };
  }
  console.log(surv);
  let i = 0;
  return (
    surv.length !== 0 && (
      <Container fixed sx={{ padding: "1rem", marginTop: "2rem" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h3">{surv.title}</Typography>
            <Typography sx={{ marginBottom: "1rem" }} variant="h6">
              {surv?.description}
            </Typography>
          </Grid>
          <Grid item xs={6} alignContent={"flex-end"}>
            <Button sx={{ background: "#2c13ea" }} variant="contained">
              Download Report
            </Button>
          </Grid>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Item>
                Start date:{" "}
                {new Date(surv?.startDate).toISOString().slice(0, 10)}
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                End date: {new Date(surv?.endDate).toISOString().slice(0, 10)}
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>Survey Questions:</Item>
            </Grid>
            <Grid item xs={12}>
              {surv.questions.map((survey) => (
                <Item key={i++} elevation={0}>
                  {survey}
                </Item>
              ))}
            </Grid>
            <Grid item xs={12}>
              <Item>Participants:</Item>
            </Grid>
            <Grid item xs={12}>
              {surv.participants.map((survey) => (
                <Item key={i++} elevation={0}>
                  {survey}
                </Item>
              ))}
            </Grid>
          </Grid>
        </Box>
      </Container>
    )
  );
}

export default Results;
