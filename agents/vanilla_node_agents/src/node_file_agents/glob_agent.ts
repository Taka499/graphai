import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import type { GraphAIBaseDirName, GraphAIFileName, GraphAIText, GraphAIArray, GraphAIData } from "@graphai/agent_utils";

import path from "path";
import glob from "glob";

export const globAgent: AgentFunction<
  GraphAIBaseDirName,
  GraphAIArray<GraphAIFileName>,
  GraphAIText
> = async ({ namedInputs, params }) => {
    const baseDir = path.normalize(params.baseDir);

    assert(!!baseDir, "globAgent: params.baseDir is UNDEFINED!");

    const globFiles = (pattern: string) => {
      const fullPattern = path.join(baseDir, pattern);

      return glob.sync(fullPattern).map(file => {
        // Use path.relative which handles cross-platform path differences properly
        return { file: path.relative(baseDir, file) };
      });
    };

    if (namedInputs.text) {
      return { array: globFiles(namedInputs.text) };
    }
    throw new Error("globAgent no pattern");
  };

const sampleInput1 = { text: "**/test.txt" };
const sampleInput2 = { text: "**/test.*" };
const sampleParams = { baseDir: __dirname + "/../../tests/files/" };
const sampleResult1 = { array: [{file: "test.txt"}] };
const sampleResult2 = { array: [{file: "test.m4a"}, {file: "test.txt"}] };

const globAgentInfo: AgentFunctionInfo = {
  name: "globAgent",
  agent: globAgent,
  mock: globAgent,
  inputs: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "base directory name",
      }
    }
  },
  output: {
    type: "object",
    properties: {
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