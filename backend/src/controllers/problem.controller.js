import { db } from "../libs/db.js";


export const createProblem = async (req, res) => {
	const {title, description, difficulty, tags, userId, example, constraints, hints, editorial, testcases, codeSnippets, referenceSolution} = req.body
    
    if (req.user.role !== "ADMIN"){
        return res.status(403).json({message: "Only admins can create problems"})
    }

    try {
        for (const [language, solutionCode] of Object.entries(referenceSolution)) {
            const languageId = getJudge0LanguageId(language);

            if (!languageId) {
                return res.status(400).json({error: `Unsupported language: ${language}`});
            }
            
            const submission = testcases.map(({input, output}) => ({
                source_code: solutionCode,
                language_id: languageId,                
                stdin: input,
                expected_output: output
            }));

            const submissionResults = await submitBatch(submissions);

            const tokens = submissionResults.map((res) => res.token)
        }

                
    } catch (error) {
        
    }
};


export const getAllProblems = async (req,res) => {

}

export const getAllProblemById = async (req,res) => {

}

export const updateProblem = async (req, res)=>{

}

export const deleteProblem = async (req,res) => {

}

export const getAllSolvedProblemsByUser = async (req, res)=>{
    
}