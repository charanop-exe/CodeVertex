import axios from 'axios';

export const getJudge0LanguageId = (language) => {
    const languageMap = {  
        "CPP": 51,
        "JAVA": 62,
        "JAVASCRIPT": 63,
        "PYTHON": 71,
    };
    return languageMap[language.toUpperCase()] || null;
};

export const submitBatch = async (submissions) => {

    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {
        submissions,
    })

}