import "survey-core/defaultV2.min.css";
import { Survey } from "survey-react-ui";
import { StylesManager, Model } from "survey-core";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

StylesManager.applyTheme("defaultV2");

function CompleteSurvey() {
  const [surv, setSurvey] = useState([]);
  const param = useParams();

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

  console.log(surv);
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

  async function SaveSurveyResults(json) {
    console.log(json);
  }

  const survey = new Model(surveyJson);
  const surveyComplete = useCallback((sender) => {
    SaveSurveyResults(sender.data);
  }, []);

  survey.onComplete.add(surveyComplete);

  return <Survey model={survey} />;
}

export default CompleteSurvey;
