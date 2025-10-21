// import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.libs.js";
// import { db } from "../libs/db.js";

// export const executeCode = async (req, res) => {
//     try {
//         const { source_code, language_id, stdin , expected_outputs,problemId } = req.body;
        
//         const userId = req.user.id;

//         if (
//             !Array.isArray(stdin) ||
//             stdin.length === 0 ||
//             !Array.isArray(expected_outputs) ||
//             expected_outputs.length !== stdin.length 
//         ){

//             return res.status(400).json({ 
//                 error: "Invalid stdin or expected_outputs format" 
//         })
//         }

//         // Prepare each test casec
//         const submissions = stdin.map((input) => ({
//             source_code,
//             language_id,
//             stdin: input,
//             base64_encoded: false,
//         }));

//         // Execute all test cases in parallel
//         const submitResponse = await submitBatch(submissions);

//         const tokens = submitResponse.map((res) => res.token);

//         const results = await pollBatchResults(tokens);

//         // console.log("Results from Judge0 API ---------->");
//         // console.log(results);

//         let allPassed = true;
//         const detailedResults = results.map((result, index) => {
//             const stdout = result.stdout?.trim();
//             const expectedOutput = expected_outputs[index]?.trim();
//             const passed = stdout === expectedOutput;
                
//             // console.log(`Test Case ${index + 1}: ${passed ? "Passed" : "Failed"}`);
//             // console.log(`Input: ${stdin[index]}`);
//             // console.log(`Expected Output: ${expectedOutput}`);
//             // console.log(`Actual Output: ${stdout}`);

//             if(!passed){
//                 allPassed = false;
//             }
//             return {
//                 testCase: index + 1,
//                 passed : passed,
//                 stdout : stdout, 
//                 expected : expectedOutput,
//                 stderr : result.stderr || null,
//                 compile_output : result.compile_output || null,
//                 status : result.status.description,
//                 time : result.time ? `${result.time} sec` : undefined,
//                 memory : result.memory ? `${result.memory} KB` : undefined,
//             };
        
//     });
//     // console.log("detailedResults ---------->", detailedResults);

//         const submission = await db.submission.create({
//             data : {
//             userId: userId,
//             problemId: problemId,
//             sourceCode: source_code,
//             language_id: getLanguageName(language_id),
//             stdin: stdin.join('\n'),
//             stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
//             stderr : detailedResults.some(r => r.stderr) 
//                 ? JSON.stringify(detailedResults.map((r) => r.stderr))
//                 : null,
//             compileOutput : detailedResults.some(r => r.compile_output)
//                 ? JSON.stringify(detailedResults.map((r) => r.compile_output))
//                 : null,
//             status: allPassed ? "Accepted" : "Wrong Answer",
//             memory: detailedResults.some((r) => r.memory)
//                 ? JSON.stringify(detailedResults.map((r) => r.memory))
//                 : null,
//             time: detailedResults.some((r) => r.time)
//                 ? JSON.stringify(detailedResults.map((r) => r.time))
//                 : null,
            
//         },
//     });

//         if (allPassed){
//             // Update problem stats
//             await db.problemSolved.upsert({
//                 where : {
//                     userId_problemId : {
//                         userId : userId,
//                         problemId : problemId,
//                     }
//                 },
//                 update:{

//                 },
//                 create :{
//                     userId : userId,
//                     problemId : problemId,
//                 }
//             });
//         }

//         const testCaseResult = detailedResults.map((result) => ({
//             submissionId : submission.id,
//             testCase : result.testCase,
//             passed : result.passed,
//             stdout : result.stdout,
//             expected : result.expected,
//             stderr : result.stderr,
//             compileOutput : result.compile_output,
//             status : result.status,
//             time : result.time,
//             memory : result.memory,
//         }));

//         await db.testCaseResult.createMany({
//             data : testCaseResult,
//         });

//         const submissionWithTestCases = await db.submission.findUnique({
//             where : {
//                 id : submission.id,
//             },
//             include : {
//                 testCases : true,
//             }
//         });
        

//         // Check if all test cases passed
//         return res.status(200).json({
//             sucess : true,
//             submission : submissionWithTestCases,
//             message : "Code executed successfully"
//         })

//     } catch (error) {
//         console.log("Invalid stdin or expected_outputs format");
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// }

import { db } from "../libs/db.js"; // ✅ 1. Import the Prisma Client
import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.libs.js";

export const executeCode = async (req, res) => {
    try {
        const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;
        const userId = req.user.id;

        // ... your validation logic is correct ...
        if (!Array.isArray(stdin) || stdin.length === 0 || !Array.isArray(expected_outputs) || expected_outputs.length !== stdin.length) {
            return res.status(400).json({ error: "Invalid stdin or expected_outputs format" });
        }

        const submissions = stdin.map((input) => ({
            source_code,
            language_id,
            stdin: input,
        }));

        const submitResponse = await submitBatch(submissions);
        const tokens = submitResponse.map((res) => res.token);
        const results = await pollBatchResults(tokens);

        let allPassed = true;
        let overallStatus = "Accepted";

        const detailedResults = results.map((result, index) => {
            const stdout = result.stdout?.trim();
            const expectedOutput = expected_outputs[index]?.trim();

            // ✅ 2. Correct "passed" logic: Must be Accepted status AND match output
            const passed = result.status.id === 3 && stdout === expectedOutput;
            let currentStatus = result.status.description;

            if (passed) {
                currentStatus = "Accepted";
            } else {
                allPassed = false;
                // If it was supposed to be accepted but output is wrong, it's a "Wrong Answer"
                if (result.status.id === 3) {
                    currentStatus = "Wrong Answer";
                }
                // Set the overall status to the first failure encountered
                if (overallStatus === "Accepted") {
                    overallStatus = currentStatus;
                }
            }

            return {
                testCase: index + 1,
                passed,
                status: currentStatus,
                stdout,
                expected: expectedOutput,
                stderr: result.stderr || null,
                compile_output: result.compile_output || null,
                time: result.time,
                memory: result.memory,
            };
        });

        // ✅ 3. Save the submission with a simple, correct structure
        const submission = await db.submission.create({
            data: {
                userId: userId,
                problemId: problemId,
                sourceCode: { code: source_code }, // Store as JSON object per schema
                language: getLanguageName(language_id),
                status: overallStatus,
                // Store aggregated results, not arrays
                time: results.reduce((acc, r) => acc + parseFloat(r.time || 0), 0).toFixed(3), // Total time
                memory: Math.max(...results.map(r => r.memory || 0)), // Max memory
            },
        });

        const testCaseResultData = detailedResults.map((result) => ({
            submissionId: submission.id,
            testCase: result.testCase,
            passed: result.passed,
            stdout: result.stdout,
            expected: result.expected,
            stderr: result.stderr,
            compileOutput: result.compile_output, // ✅ 4. Fixed typo (compileOutput)
            status: result.status,
            time: result.time ? result.time.toString() : null,
            memory: result.memory ? result.memory.toString() : null,
        }));

        await db.testCaseResult.createMany({
            data: testCaseResultData,
        });

        // ✅ 5. Correctly handle the ProblemSolved table logic
        if (allPassed) {
            await db.problemSolved.upsert({
                where: { userId_problemId: { userId, problemId } },
                update: {}, // No need to update if it already exists
                create: { userId, problemId },
            });
        }

        const submissionWithTestCases = await db.submission.findUnique({
            where: { id: submission.id },
            include: {
                testCaseResults: true, // ✅ 6. Correct relation name
            },
        });

        // ✅ 7. Send ONE final response for both success and failure cases
        return res.status(200).json({
            success: true,
            allPassed: allPassed,
            submission: submissionWithTestCases,
            message: "Code executed and submission saved successfully"
        });

    } catch (error) {
        console.error("Error in executeCode:", error); // Log the actual error
        return res.status(500).json({ error: "Internal Server Error" });
    }
};