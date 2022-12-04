import { useEffect, useState } from "react";
import { Container, Grid, Card } from "@mui/material";
import axios from "axios";
import { useAuth } from "../../util/AuthProvider";
import * as React from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Responses = () => {
  const [surveys, setSurveys] = useState([]);
  const user = useAuth();

  useEffect(() => {
    const getUsers = async () => {
      const body = {
        userID: user.user.email,
      };
      try {
        const result = await axios.post(
          "http://127.0.0.1:7777/getcreatorsurveylist",
          body
        );
        console.log(result);

        setSurveys(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, [user.user.email]);

  console.log(surveys);

  return (
    <Container fixed sx={{ padding: "1rem", marginTop: "2rem" }}>
      {surveys.length !== 0 && (
        <Typography sx={{ marginBottom: "1rem" }} variant="h3">
          Your Survey Responses
        </Typography>
      )}
      {surveys.length === 0 && (
        <Typography sx={{ marginBottom: "1rem" }} variant="h3">
          You have created no surveys
        </Typography>
      )}
      <Grid container spacing={2}>
        {surveys &&
          surveys.map((survey) => (
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
                  <Button size="small">View Results</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default Responses;
