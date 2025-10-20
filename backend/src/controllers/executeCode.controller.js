import { getLanguageId, getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.libs.js";

export const executeCode = async (req, res) => {
    try {
        const { source_code, language_id, stdin , expected_outputs,problemId } = req.body;
        
        const userId = req.user.id;

        if (
            !Array.isArray(stdin) ||
            stdin.length === 0 ||
            !Array.isArray(expected_outputs) ||
            expected_outputs.length !== stdin.length 
        ){

            return res.status(400).json({ 
                error: "Invalid stdin or expected_outputs format" 
        })
        }

        // Prepare each test casec
        const submissions = stdin.map((input) => ({
            source_code,
            language_id,
            stdin: input,
            base64_encoded: false,
        }));

        // Execute all test cases in parallel
        const submitResponse = await submitBatch(submissions);

        const tokens = submitResponse.map((res) => res.token);

        const results = await pollBatchResults(tokens);

        // console.log("Results from Judge0 API ---------->");
        // console.log(results);

        let allPassed = true;
        const detailedResults = results.map((result, index) => {
            const stdout = result.stdout?.trim();
            const expectedOutput = expected_outputs[index]?.trim();
            const passed = stdout === expectedOutput;
                
            // console.log(`Test Case ${index + 1}: ${passed ? "Passed" : "Failed"}`);
            // console.log(`Input: ${stdin[index]}`);
            // console.log(`Expected Output: ${expectedOutput}`);
            // console.log(`Actual Output: ${stdout}`);

            if(!passed){
                allPassed = false;
            }
            return {
                testCase: index + 1,
                passed : passed,
                stdout : stdout, 
                expected : expectedOutput,
                stderr : result.stderr || null,
                compile_output : result.compile_output || null,
                status : result.status.description,
                time : result.time ? `${result.time} sec` : undefined,
                memory : result.memory ? `${result.memory} KB` : undefined,
            };
        
    });
    // console.log("detailedResults ---------->", detailedResults);

        const submission = await db.submission.create({
            data : {
            userId: userId,
            problemId: problemId,
            sourceCode: source_code,
            language_id: getLanguageName(language_id),
            stdin: stdin.join('\n'),
            stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
            stderr : detailedResults.some(r => r.stderr) 
                ? JSON.stringify(detailedResults.map((r) => r.stderr))
                : null,
            compileOutput : detailedResults.some(r => r.compile_output)
                ? JSON.stringify(detailedResults.map((r) => r.compile_output))
                : null,
            status: allPassed ? "Accepted" : "Wrong Answer",
            memory: detailedResults.some((r) => r.memory)
                ? JSON.stringify(detailedResults.map((r) => r.memory))
                : null,
            time: detailedResults.some((r) => r.time)
                ? JSON.stringify(detailedResults.map((r) => r.time))
                : null,
            
        },
    });

        if(!allPassed){
            return res.status(200).json({
                message : "Some test cases failed",
                detailedResults : detailedResults,
            })
        }

        if (allPassed){
            // Update problem stats
            await db.problem.update({
                where : {
                    userId_problemId : {
                        userId : userId,
                        problemId : problemId,
                    }
                },
                update:{

                },
                create :{
                    userId : userId,
                    problemId : problemId,
                }
            });
        }
        
        
        

        // Check if all test cases passed
        return res.status(200).json({
            message : "Code executed successfully"
        })

    } catch (error) {
        console.log("Invalid stdin or expected_outputs format");
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
