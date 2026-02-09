import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Plus,
    Trash2,
    Code2,
    FileText,
    Lightbulb,
    BookOpen,
    CheckCircle2,
    Download,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/* -------------------- SCHEMA -------------------- */
const problemSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    tags: z.array(z.string()).min(1),
    constraints: z.string(),
    hints: z.string().optional(),
    editorial: z.string().optional(),
    testcases: z.array(
        z.object({
            input: z.string(),
            output: z.string(),
        })
    ),
    examples: z.object({
        JAVASCRIPT: z.object({
            input: z.string(),
            output: z.string(),
            explanation: z.string().optional(),
        }),
        PYTHON: z.object({
            input: z.string(),
            output: z.string(),
            explanation: z.string().optional(),
        }),
        JAVA: z.object({
            input: z.string(),
            output: z.string(),
            explanation: z.string().optional(),
        }),
    }),
    codeSnippets: z.object({
        JAVASCRIPT: z.string(),
        PYTHON: z.string(),
        JAVA: z.string(),
    }),
    referenceSolutions: z.object({
        JAVASCRIPT: z.string(),
        PYTHON: z.string(),
        JAVA: z.string(),
    }),
});

/* -------------------- SAMPLE DATA -------------------- */
/* (UNCHANGED – uses your existing samples) */
import { sampledpData, sampleStringProblem } from "./sampleProblems";

/* -------------------- COMPONENT -------------------- */
const CreateProblemForm = () => {
    const navigate = useNavigate();
    const [sampleType, setSampleType] = useState("DP");
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: {
            tags: [""],
            testcases: [{ input: "", output: "" }],
            examples: {
                JAVASCRIPT: { input: "", output: "", explanation: "" },
                PYTHON: { input: "", output: "", explanation: "" },
                JAVA: { input: "", output: "", explanation: "" },
            },
            codeSnippets: {
                JAVASCRIPT: "",
                PYTHON: "",
                JAVA: "",
            },
            referenceSolutions: {
                JAVASCRIPT: "",
                PYTHON: "",
                JAVA: "",
            },
        },
    });

    const { fields: tagFields, append: addTag, remove: removeTag } =
        useFieldArray({ control, name: "tags" });

    const {
        fields: testCaseFields,
        append: addTestCase,
        remove: removeTestCase,
    } = useFieldArray({ control, name: "testcases" });

    /* -------------------- LOAD SAMPLE (FIXED) -------------------- */
    const loadSampleData = () => {
        const sample =
            sampleType === "DP" ? sampledpData : sampleStringProblem;

        reset({
            title: sample.title,
            description: sample.description,
            difficulty: sample.difficulty,
            tags: sample.tags,
            constraints: sample.constraints,
            hints: sample.hints,
            editorial: sample.editorial,
            testcases: sample.testcases,
            examples: sample.examples,
            codeSnippets: sample.codeSnippets,
            referenceSolutions: sample.referenceSolutions,
        });

        toast.success("Sample loaded");
    };

    /* -------------------- SUBMIT -------------------- */
    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            await axiosInstance.post("/problems/create-problem", data);
            toast.success("Problem created successfully");
            navigate("/");
        } catch (err) {
            toast.error("Failed to create problem");
        } finally {
            setIsLoading(false);
        }
    };

    /* -------------------- UI -------------------- */
    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="bg-base-100 rounded-2xl shadow-xl p-6 md:p-10">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FileText className="text-primary" />
                        Create Problem
                    </h1>

                    <div className="flex gap-2">
                        <button
                            className={`btn btn-sm ${sampleType === "DP" ? "btn-primary" : "btn-outline"
                                }`}
                            onClick={() => setSampleType("DP")}
                            type="button"
                        >
                            DP
                        </button>
                        <button
                            className={`btn btn-sm ${sampleType === "STRING" ? "btn-primary" : "btn-outline"
                                }`}
                            onClick={() => setSampleType("STRING")}
                            type="button"
                        >
                            String
                        </button>
                        <button
                            className="btn btn-secondary btn-sm gap-2"
                            onClick={loadSampleData}
                            type="button"
                        >
                            <Download size={16} />
                            Load Sample
                        </button>
                    </div>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-10 mt-8"
                >
                    {/* BASIC INFO */}
                    <div className="space-y-4">
                        <input
                            {...register("title")}
                            placeholder="Problem Title"
                            className="input input-bordered w-full"
                        />

                        <textarea
                            {...register("description")}
                            placeholder="Problem Description"
                            className="textarea textarea-bordered w-full min-h-[140px]"
                        />

                        <select
                            {...register("difficulty")}
                            className="select select-bordered w-full max-w-xs"
                        >
                            <option value="EASY">Easy</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HARD">Hard</option>
                        </select>
                    </div>

                    {/* TAGS */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold flex items-center gap-2">
                                <BookOpen size={18} /> Tags
                            </h3>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline"
                                onClick={() => addTag("")}
                            >
                                <Plus size={14} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {tagFields.map((field, i) => (
                                <div key={field.id} className="flex gap-2">
                                    <input
                                        {...register(`tags.${i}`)}
                                        className="input input-bordered w-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeTag(i)}
                                        className="btn btn-ghost btn-square"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TEST CASES */}
                    <div>
                        <div className="flex justify-between mb-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <CheckCircle2 size={18} /> Test Cases
                            </h3>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline"
                                onClick={() => addTestCase({ input: "", output: "" })}
                            >
                                <Plus size={14} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {testCaseFields.map((field, i) => (
                                <div
                                    key={field.id}
                                    className="grid md:grid-cols-2 gap-4"
                                >
                                    <textarea
                                        {...register(`testcases.${i}.input`)}
                                        placeholder="Input"
                                        className="textarea textarea-bordered"
                                    />
                                    <textarea
                                        {...register(`testcases.${i}.output`)}
                                        placeholder="Expected Output"
                                        className="textarea textarea-bordered"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CODE SECTIONS */}
                    {["JAVASCRIPT", "PYTHON", "JAVA"].map((lang) => (
                        <div key={lang} className="space-y-6">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Code2 size={18} /> {lang}
                            </h3>

                            <Controller
                                name={`codeSnippets.${lang}`}
                                control={control}
                                render={({ field }) => (
                                    <Editor
                                        height="280px"
                                        theme="vs-dark"
                                        language={lang.toLowerCase()}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />

                            <Controller
                                name={`referenceSolutions.${lang}`}
                                control={control}
                                render={({ field }) => (
                                    <Editor
                                        height="280px"
                                        theme="vs-dark"
                                        language={lang.toLowerCase()}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    ))}

                    {/* EXTRA */}
                    <div className="space-y-4">
                        <textarea
                            {...register("constraints")}
                            placeholder="Constraints"
                            className="textarea textarea-bordered"
                        />
                        <textarea
                            {...register("hints")}
                            placeholder="Hints (optional)"
                            className="textarea textarea-bordered"
                        />
                        <textarea
                            {...register("editorial")}
                            placeholder="Editorial (optional)"
                            className="textarea textarea-bordered min-h-[160px]"
                        />
                    </div>

                    {/* SUBMIT */}
                    <div className="flex justify-end">
                        <button className="btn btn-primary btn-lg">
                            {isLoading ? "Creating..." : "Create Problem"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProblemForm;
