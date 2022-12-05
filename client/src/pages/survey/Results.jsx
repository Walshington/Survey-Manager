import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../util/AuthProvider";
import { Container, Grid, Paper, Box, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { jsPDF } from "jspdf";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.primary,
}));

function Results() {
  const [surv, setSurvey] = useState([]);
  const [report, setReport] = useState([]);
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
        const report = await axios.post("http://127.0.0.1:7777/report", body);
        console.log(report.data);
        setSurvey(result.data[0]);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, [param.id]);

  const handleDownload = () => {
    var doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor("blue");
    doc.text("Survey Report", 105, 20, null, null, "center");
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`${surv.title}`, 105, 30, null, null, "center");
    doc.setFontSize(14);
    doc.text(`${surv.description}`, 105, 38, null, null, "center");
    doc.text(
      `Period: ${new Date(surv?.startDate)
        .toISOString()
        .slice(0, 10)} - ${new Date(surv?.endDate).toISOString().slice(0, 10)}`,
      105,
      45,
      null,
      null,
      "center"
    );
    doc.text("Participants", 105, 55, null, null, "center");
    let i = 65;
    surv.participants.forEach((participant) => {
      doc.text(`${participant}`, 105, i, null, null, "center");
      i += 6;
    });
    i += 4;
    doc.text("Questions", 105, i, null, null, "center");
    i += 10;
    surv.questions.forEach((question) => {
      doc.text(`${question}`, 105, i, null, null, "center");
      i += 6;
    });
    doc.setTextColor("blue");
    doc.text("Type 1 Question", 105, (i += 4), null, null, "center");
    doc.setTextColor(0);
    doc.text("Mean: - Variance:", 105, (i += 6), null, null, "center");
    doc.setTextColor("blue");
    doc.text("Type 2 Questions", 105, (i += 10), null, null, "center");
    doc.setTextColor(0);
    doc.text("Text question 1", 105, (i += 6), null, null, "center");
    doc.text("- Answer 1", 105, (i += 6), null, null, "center");
    doc.text("- Answer 2", 105, (i += 6), null, null, "center");
    doc.text("- Answer 3", 105, (i += 6), null, null, "center");

    doc.save("report.pdf");
  };

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
            <Button
              onClick={() => handleDownload()}
              sx={{ background: "#2c13ea" }}
              variant="contained"
            >
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
