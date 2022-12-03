// Default V2 theme
import "survey-core/defaultV2.min.css";
import { Survey } from "survey-react-ui";
// Modern theme
// import 'survey-core/modern.min.css';
import { StylesManager, Model } from "survey-core";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";

StylesManager.applyTheme("defaultV2");

function CreateSurvey() {
  const [email, setEmails] = useState([]);

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

  const surveyJson = {
    elements: [
      {
        name: "Title",
        title: "Enter the survey title:",
        type: "text",
        isRequired: true,
      },
      {
        name: "Emails",
        title: "Enter the emails of your survey participants:",
        type: "tagbox",
        description: "Please select all that apply.",
        isRequired: true,
        choices: email,
      },
      {
        name: "Description",
        title: "Enter the description of the survey:",
        type: "text",
        isRequired: true,
      },
      {
        name: "EndTime",
        title: "Enter the end date of your survey:",
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
            name: "questions types",
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
    console.log(sender.data);
  }, []);

  survey.onComplete.add(surveyComplete);

  return <Survey model={survey} />;
}

export default CreateSurvey;
