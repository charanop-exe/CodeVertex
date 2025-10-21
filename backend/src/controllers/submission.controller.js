import { db } from "../libs/db.js";

export const getAllSubmissions = async(req, res) => {
    try {
        const userId = req.user.id;

        const submission = await db.submission.findMany({
            where: {
                userId: userId
            }
        });
        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            data: submission
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch submissions",
            error: error.message
        });
        
    }
}


export const getSubmissionById = async (req, res) => {

    const userId = req.user.id;
    const problemId = req.params.id;
    try {
        const submission = await db.submission.findMany({
            where: {
                userId: userId,
                problemId: problemId
            }
        });

        res.status(200).json({
            success: true,
            message: "Submission fetched successfully",
            data: submission
        })

    } catch (error) {
        
    }
}

export const getSubmissionCountForProblem = async (req, res) => {
    const userId = req.user.id;
    const problemId = req.params.problemId;

    try {
        const submissionCount = await db.submission.count({
            where: {
                userId: userId,
                problemId: problemId
            }
        });
        res.status(200).json({
            success: true,
            message: "Submission count fetched successfully",
            data: submissionCount
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch submission count",
            error: error.message
        });        
    }
}

