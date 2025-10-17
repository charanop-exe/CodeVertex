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


export const pollBatchResults = async (tokens) => {
    while (true) {
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
            params:{
                tokens: tokens.join(','),
                base64_encoded: false,

            }
        });

        const results = data.submissions;

        const isAllDone = results.every((r) => r.status.id >= 3);

        if (isAllDone) {
            return results;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

    }
} 


export const submitBatch = async (submissions) => {
    try {
        const { data } = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {
            submissions,
        });
        return data;
        
    } catch (error) {
        console.error("Error submitting to Judge0:", error.response?.data || error.message);
        throw new Error("Failed to submit batch to Judge0");
    }
};