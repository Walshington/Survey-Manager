import "survey-core/defaultV2.min.css";
import { Survey } from "survey-react-ui";
import { StylesManager, Model } from "survey-core";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../util/AuthProvider";

StylesManager.applyTheme("defaultV2");

function CreateSurvey() {
  const [email, setEmails] = useState([]);
  const user = useAuth();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const result = await axios.get("http://127.0.0.1:7777/users");
        const emails = result.data.map((user) => {
          return user.email;
        });
        setEmails(emails);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, []);

  async function SaveSurveyResults(json) {
    const body = {
      title: json.title,
      description: json.description,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(json.endDate).toISOString().slice(0, 10),
      questions: json.questions,
      participants: json.participants,
      createdBy: user.user.email,
    };
    await axios.post("http://127.0.0.1:7777/createsurvey", body);
  }

  const surveyJson = {
    elements: [
      {
        name: "title",
        title: "Enter the survey title:",
        type: "text",
        isRequired: true,
      },
      {
        name: "participants",
        title: "Enter the emails of your survey participants:",
        type: "tagbox",
        description: "Please select all that apply.",
        isRequired: true,
        choices: email,
      },
      {
        name: "description",
        title: "Enter the description of the survey:",
        type: "text",
        isRequired: true,
      },
      {
        name: "endDate",
        title: "Enter the end date of your survey: (YYYY-MM-DD)",
        type: "text",
        isRequired: true,
      },
      {
        type: "panel",
        name: "Questions",
        title: "Survey Questions",
        isRequired: true,
        elements: [
          {
            type: "matrixdynamic",
            name: "questions",
            title: "Choose question type and title",
            rowCount: 0,
            columns: [
              {
                name: "type",
                cellType: "dropdown",
                title: "Type (rating = type-1 | text = type-2)",
                choices: ["rating", "text"],
                isRequired: true,
              },
              {
                name: "title",
                cellType: "text",
                title: "Title",
                isRequired: true,
              },
            ],
          },
        ],
      },
    ],
  };

  const survey = new Model(surveyJson);
  const surveyComplete = useCallback((sender) => {
    SaveSurveyResults(sender.data);
  }, []);

  survey.onComplete.add(surveyComplete);

  return <Survey model={survey} />;
}

export default CreateSurvey;
