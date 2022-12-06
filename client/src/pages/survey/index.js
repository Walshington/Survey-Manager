import { useEffect, useState } from "react";
import { Container, Grid, Card } from "@mui/material";
import axios from "axios";
import { useAuth } from "../../util/AuthProvider";
import * as React from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const SurveyCards = () => {
  const [surveys, setSurveys] = useState([]);
  const user = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      const body = {
        email: user.user.email,
      };
      try {
        const result = await axios.post(
          "http://127.0.0.1:7777/getparticipantsurveylist",
          body
        );
        const surveys = result.data.filter((x) => x.status === 0);
        const a = Promise.all(
          surveys.map(async (survey) => {
            const x = await axios.post("http://127.0.0.1:7777/getsurvey", {
              surveyID: survey.surveyID,
            });
            return x.data[0];
          })
        );
        setSurveys((await a).filter((s) => new Date(s.endDate) >= new Date()));
      } catch (err) {
        throw new Error("Error in survey index", err);
      }
    };
    getUsers();
  }, [user.user.email]);
  console.log(surveys);
  console.log(user.user.email);

  return (
    <Container fixed sx={{ padding: "1rem", marginTop: "2rem" }}>
      {surveys.length !== 0 && (
        <Typography sx={{ marginBottom: "1rem" }} variant="h3">
          Available Surveys
        </Typography>
      )}
      {surveys.length === 0 && (
        <Typography sx={{ marginBottom: "1rem" }} variant="h3">
          No Surveys Available
        </Typography>
      )}
      <Grid container spacing={2}>
        {surveys.length !== 0 &&
          surveys?.map((survey) => (
            <Grid key={survey.id} item xs={12} sm={6} md={4}>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {survey.title}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Ends at:{" "}
                    {new Date(survey.endDate).toISOString().slice(0, 10)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={() => navigate(`/surveys/${survey.id}`)}
                    size="small"
                  >
                    Complete Survey
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default SurveyCards;
