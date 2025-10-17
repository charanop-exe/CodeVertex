import { db } from "../libs/db.js";
// Make sure your helper functions are imported
import { getJudge0LanguageId, submitBatch, pollBatchResults } from '../libs/judge0.libs.js'; // Adjust path as needed

export const createProblem = async (req, res) => {
    // FIX: Removed 'userId' from destructuring to avoid confusion.
    // We will use req.user.id from the authenticated user.
    const { title, description, difficulty, tags, examples, constraints, hints, editorial, testcases, codeSnippets, referenceSolutions } = req.body;

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Only admins can create problems" });
    }

    try {
        // First, validate ALL reference solutions before creating the problem.
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language);

            if (!languageId) {
                return res.status(400).json({ error: `Unsupported language: ${language}` });
            }

            // FIX: Renamed variable to 'submissions' (plural) for clarity.
            const submissions = testcases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output
            }));

            // FIX: Now using the correct variable name 'submissions'.
            const submissionResults = await submitBatch(submissions);
            const tokens = submissionResults.map((res) => res.token);
            const results = await pollBatchResults(tokens);

            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                // Status 3 means "Accepted"
                if (result.status.id !== 3) {
                    return res.status(400).json({
                        error: `Reference solution failed for language ${language} on testcase ${i + 1}`,
                        details: {
                            status: result.status,
                            stderr: result.stderr || null,
                            stdout: result.stdout || null
                        }
                    });
                }
            }
        }

        // FIX: Create the problem in the database ONLY AFTER all solutions are validated.
        const newProblem = await db.problem.create({
            data: {
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                hints,
                editorial,
                testcases, // Note: Ensure your Prisma schema can handle these JSON objects
                codeSnippets,
                referenceSolutions,
                userId: req.user.id // This is the correct and secure way
            }
        });

        // FIX: This return statement now works correctly.
        return res.status(201).json({ problem: newProblem });

    } catch (error) {
        // FIX: Added error handling to the catch block.
        console.error("Failed to create problem:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// --- Your other functions ---

export const getAllProblems = async (req, res) => { 
    try {
        const problems = await db.problem.findMany();

        if (!problems){
            return res.status(404).json({
                message : "No Problems Found"
            })
        }
        res.status(200).json({ 
            sucess: true,
            message: "Problems Fetched Successfully",
            problems
        });
    } catch (error) {
        return res.status(500).json({       
            error:"Error in Fetching Problems"
        })
    }
};


export const getProblemById = async (req, res) => { 
    try {
        const id  = req.params.id;
        const problem = await db.problem.findUnique({
            where : {
                id : id
            }
        });

        if (!problem){
            return res.status(404).json({
                message : "Problem Not Found"
            })
        }

        res.status(200).json({
            sucess: true,
            message: "Problem Fetched Successfully",
            problem
        })
    } catch (error) {
        return res.status(500).json({
            error:"Error in Fetching Problem By Id"
        })
    }
};


export const updateProblem = async (req, res) => { /* ... */ };
export const deleteProblem = async (req, res) => { /* ... */ };
export const getAllSolvedProblemsByUser = async (req, res) => { /* ... */ };