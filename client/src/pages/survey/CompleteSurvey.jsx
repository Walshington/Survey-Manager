import "survey-core/defaultV2.min.css";
import { Survey } from "survey-react-ui";
import { StylesManager, Model } from "survey-core";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../util/AuthProvider";

StylesManager.applyTheme("defaultV2");

function CompleteSurvey() {
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

  const surveyJson = {
    title: surv.title,
    description: surv.description,
    elements: surv?.questions?.map((question) => {
      return question.type === "rating"
        ? {
            type: "rating",
            title: question.title,
          }
        : {
            type: "text",
            title: question.title,
            maxLength: 1500,
          };
    }),
  };

  // async function SaveSurveyResults(json) {
  //   const body = {
  //     response: json,
  //     email: user.user.email,
  //     surveyID: surv.id,
  //     dateSubmitted: new Date().toISOString().slice(0, 10),
  //   };
  //   const res = await axios.post("http://127.0.0.1:7777/updateresponse", body);

  // }

  const survey = new Model(surveyJson);
  survey.onComplete.add(async function (sender, options) {
    const json = sender.data;
    const body = {
      response: json,
      email: user.user.email,
      surveyID: surv.id,
      dateSubmitted: new Date().toISOString().slice(0, 10),
    };
    try {
      const res = await axios.post(
        "http://127.0.0.1:7777/updateresponse",
        body
      );
      console.log(res);
      if (res.status === 200) {
        options.showDataSavingSuccess();
      } else {
        options.showDataSavingError();
        throw new Error("Failed to submit survey");
      }
    } catch (error) {}
  });
  // const surveyComplete = useCallback((sender) => {
  //   SaveSurveyResults(sender.data);
  // }, []);

  // survey.onComplete.add(surveyComplete);

  return <Survey model={survey} />;
}

export default CompleteSurvey;
