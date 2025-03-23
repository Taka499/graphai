import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import type { GraphAIBaseDirName, GraphAIFilePattern, GraphAIFileName, GraphAIOutputType, GraphAIArray, GraphAIData } from "@graphai/agent_utils";

import path from "path";
import glob from "glob";

export const globAgent: AgentFunction<
  GraphAIBaseDirName,
  GraphAIBaseDirName & GraphAIArray<GraphAIFileName>,
  GraphAIFilePattern
> = async ({ namedInputs, params }) => {
    const { baseDir } = params;

    assert(!!baseDir, "fileReadAgent: params.baseDir is UNDEFINED!");

    const globFiles = (pattern: string) => {
      const fullPattern = path.join(baseDir, pattern);
      return glob.sync(fullPattern) as GraphAIArray<GraphAIFileName>
    }

    if (namedInputs.pattern) {
      return {
        baseDir: baseDir,
        array: globFiles(namedInputs.pattern),
      };
    }
    throw new Error("globAgent no pattern");
  };

const sampleInput1 = { pattern: "*.txt" };
const sampleInput2 = { pattern: "test.*" };
const sampleParams = { baseDir: __dirname + "/../../tests/files/" };
const sampleResult1 = { baseDir: __dirname + "/../../tests/files/", array: ["test.txt"] };
const sampleResult2 = { baseDir: __dirname + "/../../tests/files/", array: ["test.m4a", "test.txt"] }

const globAgentInfo: AgentFunctionInfo = {
  name: "globAgent",
  agent: globAgent,
  mock: globAgent,
  inputs: {
    type: "object",
    properties: {
      pattern: {
        type: "string",
        description: "base directory name",
      }
    }
  },
  output: {
    type: "object",
    properties: {
      baseDir: {
        type: "string",
      },
      array: {
        type: "array"
      }
    }
  },
  samples: [
    {
      inputs: sampleInput1,
      params: sampleParams,
      result: sampleResult1,
    },
    {
      inputs: sampleInput2,
      params: sampleParams,
      result: sampleResult2,
    },
  ],
  description: "Search files under the given directory that matches glob pattern",
  category: ["fs"],
  author: "Takatomo Saito",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default globAgentInfo;