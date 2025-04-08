import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface TestResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

export async function POST(req: NextRequest) {
  const { code, language, testCases }: { code: string; language: string; testCases: TestCase[] } = await req.json();

  const languageMap: Record<string, number> = {
    javascript: 63, // Node.js
    python: 71,    // Python 3
    java: 62,      // Java
    c_cpp: 54,     // C++
  };

  const languageId = languageMap[language];
  if (!languageId) {
    return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
  }

  try {
    const results: TestResult[] = [];

    // Run each test case
    for (const testCase of testCases) {
      // Submit code to Judge0
      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          source_code: code,
          language_id: languageId,
          stdin: testCase.input,
        },
        {
          headers: {
            "X-RapidAPI-Key": "467a2a3afbmsh20ad65adb6ce0c1p1bc937jsn1c15b9b8cd6d",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        }
      );

      const token: string = response.data.token;

      // Poll for the result
      let result;
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s
        result = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              "X-RapidAPI-Key": "467a2a3afbmsh20ad65adb6ce0c1p1bc937jsn1c15b9b8cd6d",
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
          }
        );
        if (result.data.status.id > 2) break; // Status > 2 means completed
      }

      const actualOutput = (result?.data.stdout || "").trim();
      const passed = actualOutput === testCase.expectedOutput.trim();

      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput,
        passed,
      });
    }

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Execution failed", details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}