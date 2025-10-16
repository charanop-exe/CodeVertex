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

            const results = await pollBatchResults(tokens)

            for (let i = 0; i < results.length; i++) {
                const result = results[i];

                if (result.status.id !== 3) {
                    return res.status(400).json({error: `Reference solution failed for language ${language} on testcase ${i + 1}`});
                }
            }   

            const newProblem = await db.problem.create({
                data: {
                    title,  
                    description,
                    difficulty,
                    tags,
                    userId,
                    example,
                    constraints,
                    hints,
                    editorial,
                    testcases,
                    codeSnippets,
                    referenceSolution,
                    userId: req.user.id
                }

            });
        }
        
        return res.status(201).json({problem: newProblem});
                
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