// Default V2 theme
import 'survey-core/defaultV2.min.css';
import { Survey } from 'survey-react-ui';
// Modern theme
// import 'survey-core/modern.min.css';
import { StylesManager, Model } from 'survey-core';

StylesManager.applyTheme("defaultV2");

const surveyJson = {
    elements: [{
        name: "Title",
        title: "Enter the survey title:",
        type: "text"
    }, {
        name: "Emails",
        title: "Enter the emails of your survey participants:",
        type: "text"
    },
    {
        name: "Description",
        title: "Enter the description of the survey:",
        type: "text"
    }, {
        name: "StartTime",
        title: "Enter the start date of your survey:",
        type: "text"
    }, {
        name: "EndTime",
        title: "Enter the end date of your survey:",
        type: "text"
    }, {
        name: "question6",
        title: "Type 1- Enter your question here",
        type: "rating"
    }, {
        name: "question7",
        title: "Type 2 - Enter your question here",
        type: "comment",
        maxLength: 200
    }]
};

function CreateSurvey() {

    const survey = new Model(surveyJson);

    return <Survey model={survey} />;
}

export default CreateSurvey;