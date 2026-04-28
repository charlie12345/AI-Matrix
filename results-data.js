const FUSION_LIVE_MATRIX_URL = "https://github.com/charlie12345/AI-Matrix/blob/main/FUSION_LIVE_MATRIX.md";
const FUSION_MODEL_STATUS_URL = "https://github.com/charlie12345/AI-Matrix/blob/main/FUSION_MODEL_STATUS.md";
const FUSION_ROOT_README_URL = "https://github.com/charlie12345/AI-Matrix/blob/main/FUSION_BUILD_README.md";

window.FUSION_RESULTS = {
  meta: {
    title: "Build-Fusion Results",
    buildName: "build-fusion / llama-cpp-turboquant-google-nvfp4-fusionlab",
    cpu: "Intel Core i5-8400 (6C / 6T)",
    gpu: "RTX 3060 12 GB",
    ram: "46 GiB DDR4",
    updated: "2026-04-28",
    summary:
      "A browsable benchmark site for the custom fusion llama.cpp stack. It tracks real winners, long-context rescue lanes, fresh APEX-family results, and the edge-case failures that decide whether a preset is safe to promote.",
    links: [
      { label: "Fusion Live Matrix", href: FUSION_LIVE_MATRIX_URL },
      { label: "Fusion Model Status", href: FUSION_MODEL_STATUS_URL },
      { label: "Root README", href: FUSION_ROOT_README_URL }
    ]
  },
  statuses: [
    {
      name: "Stable today",
      summary:
        "Normal llama.cpp serving features and the baseline fusion routes that are safe to use as daily defaults."
    },
    {
      name: "Experimental but usable",
      summary:
        "Worth testing and sometimes worth promoting, but only after direct validation on the target card and prompt shape."
    },
    {
      name: "Present in code but not ready",
      summary:
        "Keep this out of production-style recommendations until the runtime and quality risks are solved."
    }
  ],
  glossary: [
    {
      term: "ctx",
      description: "Configured context window for the run. This is the target prompt budget, not a promise that the full window is practical on every GPU."
    },
    {
      term: "cache k / v",
      description: "The KV cache formats used for keys and values, for example q4_0 / q4_0 or q8_0 / turbo2."
    },
    {
      term: "b / ub",
      description: "Batch size and micro-batch size. These can change throughput, stability, and whether the model fits at all."
    },
    {
      term: "fit-target",
      description: "VRAM headroom reserved by the build-fusion fit controls. Lower values push the card harder; higher values are safer."
    },
    {
      term: "logic score",
      description: "Hidden-answer logic suite result. This catches real reasoning or instruction-following regressions that raw tok/s numbers miss."
    },
    {
      term: "prompt / decode tok/s",
      description: "Prompt ingest speed and token generation speed. A fast prompt path does not matter much if decode collapses or outputs corrupt."
    }
  ],
  families: [
    {
      id: "gemma-4-apex",
      name: "Gemma 4 26B A4B Heretic APEX",
      shortName: "Gemma 4 APEX",
      architecture: "Gemma / APEX",
      status: "Experimental but usable",
      source: "mudler/gemma-4-26B-A4B-it-heretic-APEX-GGUF",
      summary:
        "This is the current APEX showcase family on the 3060. The practical winner is still I-Mini rather than Compact, and symmetric q4_0 / q4_0 remains the safest overall lane.",
      highlights: [
        "I-Mini q4_0 / q4_0 at 65536 and 256 / 128 is still the best balanced text preset.",
        "The broad long-context rerun stayed coherent all the way to a 262144 retrieval pass on q4_0 / q4_0.",
        "Draftless speculation is worth keeping on I-Mini, especially code-safe.",
        "Router mode still needs trimming before this family is safe to promote as a fresh standalone APEX preset set."
      ],
      recommended: [
        {
          label: "Best overall",
          value: "I-Mini, q4_0 / q4_0, ctx 65536, 256 / 128",
          supporting: "4 / 5 logic, code smoke 81.67 / 24.87, logic average 127.28 / 24.33"
        },
        {
          label: "Best max-context broad pass",
          value: "I-Mini, q4_0 / q4_0, ctx 262144, 64 / 32",
          supporting: "Retrieval pass at 60.30 / 20.10"
        },
        {
          label: "Best speculation lane",
          value: "I-Mini with code-safe",
          supporting: "Decode 54.92 vs 27.80 baseline, stayed coherent"
        },
        {
          label: "Caveat to fix before promotion",
          value: "Fresh router-side load OOMed",
          supporting: "Current APEX preset set is not yet router-safe as a standalone sidecar"
        }
      ],
      links: [
        { label: "Fusion Live Matrix", href: FUSION_LIVE_MATRIX_URL },
        { label: "Fusion Model Status", href: FUSION_MODEL_STATUS_URL }
      ],
      models: [
        {
          id: "gemma-4-apex-imini",
          name: "APEX I-Mini",
          size: "26B total / 4B active",
          status: "Experimental but usable",
          sourceFile: "gemma-4-26B-A4B-heretic-APEX-I-Mini.gguf",
          summary:
            "The practical winner. This tier kept the best balance of logic, short coding, speculation, and long-context rescue on the 3060.",
          recommendedPreset: {
            alias: "gemma-4-26b-a4b-it-heretic-apex-i-mini-q4kv",
            cache: "q4_0 / q4_0",
            context: "65536",
            batch: "256 / 128",
            fitTarget: "0",
            logic: "4 / 5",
            promptTps: "81.67",
            decodeTps: "24.87",
            note: "Best balanced text preset from the full rerun."
          },
          highlightMetrics: [
            {
              label: "Best logic average",
              value: "127.28 / 24.33",
              note: "q4_0 / q4_0 at 65536 and 256 / 128"
            },
            {
              label: "Best safe speculation decode",
              value: "54.92",
              note: "code-safe on the repeated code-rewrite bench"
            },
            {
              label: "Max retrieval pass",
              value: "262144 ctx",
              note: "q4_0 / q4_0 at 64 / 32"
            },
            {
              label: "Biggest edge-case win",
              value: "cache reuse",
              note: "63.6 s prompt dropped to 48.8 ms on the reuse pass"
            }
          ],
          kvMatrix: [
            {
              shape: "q4_0 / q4_0",
              ctx: "65536",
              batch: "256 / 128",
              logic: "4 / 5",
              prompt: "127.28",
              decode: "24.33",
              verdict: "winner",
              notes: "Best overall logic average. Code smoke landed 81.67 / 24.87."
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "65536",
              batch: "256 / 128",
              logic: "4 / 5",
              prompt: "119.31",
              decode: "23.75",
              verdict: "safe alternative",
              notes: "Still coherent, but slower than the q4_0 / q4_0 winner."
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "65536",
              batch: "256 / 128",
              logic: "3 / 5",
              prompt: "123.57",
              decode: "23.96",
              verdict: "regressed",
              notes: "The rerun slipped on the logic suite, so this is no longer the recommended mixed lane."
            },
            {
              shape: "q8_0 / q4_0",
              ctx: "65536",
              batch: "256 / 128",
              logic: "4 / 5",
              prompt: "110.06",
              decode: "19.40",
              verdict: "coherent but slower",
              notes: "Output stayed clean, but decode speed fell too much."
            },
            {
              shape: "q4_0 / q8_0",
              ctx: "65536",
              batch: "256 / 128",
              logic: "4 / 5",
              prompt: "111.23",
              decode: "19.64",
              verdict: "coherent but slower",
              notes: "Close to q8_0 / q4_0, but still behind the symmetric winner."
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "65536",
              batch: "128 / 64",
              logic: "4 / 5",
              prompt: "102.27",
              decode: "24.48",
              verdict: "fallback batch",
              notes: "512 / 512 was not viable in the rerun; 128 / 64 stayed coherent."
            }
          ],
          longContext: [
            {
              shape: "q4_0 / q4_0",
              ctx: "98304",
              batch: "256 / 128",
              fitTarget: "0",
              prompt: "186.32",
              decode: "22.03",
              result: "retrieval pass"
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "131072",
              batch: "128 / 64",
              fitTarget: "0",
              prompt: "112.29",
              decode: "21.66",
              result: "retrieval pass"
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "131072",
              batch: "128 / 64",
              fitTarget: "128",
              prompt: "107.98",
              decode: "21.00",
              result: "retrieval pass"
            },
            {
              shape: "turbo2 / turbo2",
              ctx: "131072",
              batch: "128 / 64",
              fitTarget: "128",
              prompt: "116.07",
              decode: "21.57",
              result: "retrieval pass"
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "262144",
              batch: "64 / 32",
              fitTarget: "512",
              prompt: "60.30",
              decode: "20.10",
              result: "retrieval pass"
            }
          ],
          speculation: [
            {
              profile: "none",
              decode: "27.80",
              acceptance: "n/a",
              verdict: "baseline",
              notes: "Repeated code-rewrite bench without speculation."
            },
            {
              profile: "code-safe",
              decode: "54.92",
              acceptance: "0.92571",
              verdict: "promote",
              notes: "Best safe decode gain and output stayed coherent."
            },
            {
              profile: "moe",
              decode: "51.76",
              acceptance: "0.82244",
              verdict: "usable",
              notes: "Strong result, but still behind code-safe."
            },
            {
              profile: "code-fast",
              decode: "43.38",
              acceptance: "0.84795",
              verdict: "usable",
              notes: "Faster than baseline, but not the best return."
            },
            {
              profile: "repeat",
              decode: "41.82",
              acceptance: "0.53788",
              verdict: "usable",
              notes: "Helped speed, but acceptance was much weaker."
            }
          ],
          edgeCases: [
            {
              test: "JSON mode",
              result: "fail",
              notes: "Returned valid JSON fenced in code blocks instead of raw schema-clean output."
            },
            {
              test: "Tool calling",
              result: "pass",
              notes: "Parsed one tool call cleanly: sum_numbers."
            },
            {
              test: "Assistant prefill",
              result: "fail",
              notes: "Returned channel-style thinking text instead of a clean continuation."
            },
            {
              test: "Reasoning parser",
              result: "pass",
              notes: "reasoning_content parsed correctly with length 196."
            },
            {
              test: "Cache reuse",
              result: "pass",
              notes: "Prompt time dropped from 63588.783 ms to 48.803 ms with 12426 cached tokens."
            },
            {
              test: "Router sidecar",
              result: "risk",
              notes: "Fresh standalone router load OOMed with the current preset set."
            }
          ]
        },
        {
          id: "gemma-4-apex-compact",
          name: "APEX Compact",
          size: "26B total / 4B active",
          status: "Experimental but usable",
          sourceFile: "gemma-4-26B-A4B-heretic-APEX-Compact.gguf",
          summary:
            "Usable, but narrower. The only worthwhile lanes stayed symmetric, the context ceiling fell hard, and speculative corruption makes it a bad promotion target today.",
          recommendedPreset: {
            alias: "gemma-4-26b-a4b-it-heretic-apex-compact-q4kv",
            cache: "q4_0 / q4_0",
            context: "16384",
            batch: "128 / 64",
            fitTarget: "4096",
            logic: "4 / 5",
            promptTps: "67.85",
            decodeTps: "24.02",
            note: "Best compact text lane from the rerun."
          },
          highlightMetrics: [
            {
              label: "Best compact logic average",
              value: "86.82 / 23.51",
              note: "q4_0 / q4_0 at 16384 and 128 / 64"
            },
            {
              label: "Best compact safe alt",
              value: "84.73 / 23.01",
              note: "q8_0 / q8_0 at 16384 and 128 / 64"
            },
            {
              label: "Main limitation",
              value: "16384 ctx",
              note: "The earlier 65536 plan was not practical in the rerun."
            },
            {
              label: "Speculation risk",
              value: "visible corruption",
              note: "Outputs like for item in enough showed up under speculative profiles"
            }
          ],
          kvMatrix: [
            {
              shape: "q4_0 / q4_0",
              ctx: "16384",
              batch: "128 / 64",
              logic: "4 / 5",
              prompt: "86.82",
              decode: "23.51",
              verdict: "winner",
              notes: "Best compact overall lane. Code smoke landed 67.85 / 24.02."
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "16384",
              batch: "128 / 64",
              logic: "4 / 5",
              prompt: "84.73",
              decode: "23.01",
              verdict: "safe alternative",
              notes: "Also coherent, slightly slower than the q4_0 / q4_0 compact winner."
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "16384",
              batch: "64 / 32",
              logic: "4 / 5",
              prompt: "59.50",
              decode: "22.99",
              verdict: "fallback batch",
              notes: "Works, but the smaller batch lost too much prompt speed."
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "16384",
              batch: "128 / 64",
              logic: "n/a",
              prompt: "n/a",
              decode: "n/a",
              verdict: "not usable",
              notes: "Rerun hit empty request outputs and OOM-style failures."
            },
            {
              shape: "q8_0 / q4_0",
              ctx: "16384",
              batch: "128 / 64",
              logic: "n/a",
              prompt: "n/a",
              decode: "n/a",
              verdict: "not usable",
              notes: "Asymmetric compact lane collapsed in the rerun."
            },
            {
              shape: "q4_0 / q8_0",
              ctx: "16384",
              batch: "128 / 64",
              logic: "n/a",
              prompt: "n/a",
              decode: "n/a",
              verdict: "not usable",
              notes: "Asymmetric compact lane collapsed in the rerun."
            }
          ],
          longContext: [
            {
              shape: "q4_0 / q4_0",
              ctx: "16384",
              batch: "128 / 64",
              fitTarget: "4096",
              prompt: "86.82",
              decode: "23.51",
              result: "stable compact ceiling"
            }
          ],
          speculation: [
            {
              profile: "none",
              decode: "25.24",
              acceptance: "n/a",
              verdict: "baseline",
              notes: "Repeated code-rewrite bench without speculation."
            },
            {
              profile: "code-safe",
              decode: "52.29",
              acceptance: "n/a",
              verdict: "warning",
              notes: "Fast, but the output showed visible corruption."
            },
            {
              profile: "code-fast",
              decode: "39.96",
              acceptance: "n/a",
              verdict: "warning",
              notes: "Speed improved, but output quality degraded."
            },
            {
              profile: "repeat",
              decode: "33.36",
              acceptance: "n/a",
              verdict: "warning",
              notes: "Still showed corruption."
            },
            {
              profile: "moe",
              decode: "39.77",
              acceptance: "n/a",
              verdict: "warning",
              notes: "Speedup exists, but not safe enough to promote."
            }
          ],
          edgeCases: [
            {
              test: "JSON mode",
              result: "fail",
              notes: "Same fenced-JSON issue as I-Mini."
            },
            {
              test: "Tool calling",
              result: "pass",
              notes: "Parsed one tool call cleanly: sum_numbers."
            },
            {
              test: "Assistant prefill",
              result: "fail",
              notes: "Continuation returned channel-style thinking text."
            },
            {
              test: "Reasoning parser",
              result: "pass",
              notes: "reasoning_content parsed correctly with length 193."
            },
            {
              test: "Cache reuse",
              result: "pass",
              notes: "Prompt time dropped from 131233.086 ms to 137.542 ms with 12426 cached tokens."
            },
            {
              test: "Promotion outlook",
              result: "risk",
              notes: "Keep this tier documented, but do not promote speculative compact presets."
            }
          ]
        }
      ]
    },
    {
      id: "deepseek-r1-qwen7b",
      name: "DeepSeek R1 Distill Qwen 7B",
      shortName: "DeepSeek R1 Qwen 7B",
      architecture: "Qwen / reasoning distill",
      status: "Experimental but usable",
      source: "DeepSeek-R1-Distill-Qwen-7B-Q6_K.gguf",
      summary:
        "This family still has one honest short-context lane on the 3060, but the broader rerun knocked out the TurboQuant and q4 variants as promotion candidates. It is useful as a reasoning-parser and cache-reuse check, not as a long-context showcase.",
      highlights: [
        "q8_0 / q8_0 at 32768 and 256 / 128 is still the only practical DeepSeek default from the rerun.",
        "Mixed TurboQuant and asymmetric KV lanes gained a little speed but all lost quality and fell to 2 / 5 or worse.",
        "Reasoning parsing and cache reuse are strong, but JSON mode, tool calling, and assistant-prefill are weak.",
        "This is not a real 65k or 131k lane on the 3060. The long-context attempts either OOMed, hung, or decoded garbage."
      ],
      recommended: [
        {
          label: "Best overall",
          value: "q8_0 / q8_0, ctx 32768, 256 / 128",
          supporting: "3 / 5 logic, about 469.77 / 17.76 on the hidden-answer suite"
        },
        {
          label: "Best client alias to keep",
          value: "deepseek-r1-distill-qwen-7b-q6k-reasoning",
          supporting: "The matching opencode alias is the only other promoted DeepSeek lane"
        },
        {
          label: "Strongest edge-case win",
          value: "cache reuse",
          supporting: "Prompt time dropped from about 19435.605 ms to about 110.447 ms with 12415 cached tokens"
        },
        {
          label: "Main caveat",
          value: "not a long-context or structured-output lane",
          supporting: "JSON, tools, and prefill were weak, and 65536+ probes were not promotable"
        }
      ],
      links: [
        { label: "Fusion Live Matrix", href: FUSION_LIVE_MATRIX_URL },
        { label: "Fusion Model Status", href: FUSION_MODEL_STATUS_URL }
      ],
      models: [
        {
          id: "deepseek-r1-qwen7b-q6k",
          name: "DeepSeek R1 Distill Qwen 7B Q6_K",
          size: "7B",
          status: "Experimental but usable",
          sourceFile: "DeepSeek-R1-Distill-Qwen-7B-Q6_K.gguf",
          summary:
            "Keep this family around for short or medium reasoning prompts, parser validation, and prompt-cache checks. Do not treat it as a strong router, tool, or long-context model on this card.",
          recommendedPreset: {
            alias: "deepseek-r1-distill-qwen-7b-q6k-reasoning",
            cache: "q8_0 / q8_0",
            context: "32768",
            batch: "256 / 128",
            fitTarget: "0",
            logic: "3 / 5",
            promptTps: "469.77",
            decodeTps: "17.76",
            note: "Only honest DeepSeek lane from the full rerun."
          },
          highlightMetrics: [
            {
              label: "Best logic average",
              value: "469.77 / 17.76",
              note: "q8_0 / q8_0 at 32768 and 256 / 128"
            },
            {
              label: "Fastest mixed alt",
              value: "537.96 / 20.14",
              note: "q8_0 / turbo2 was faster but fell to 2 / 5"
            },
            {
              label: "Biggest edge-case win",
              value: "110.447 ms second prompt",
              note: "Cache reuse with 12415 cached tokens"
            },
            {
              label: "Practical ceiling",
              value: "32768 ctx",
              note: "The 65536 and 131072 attempts were not promotable on this 3060"
            }
          ],
          kvMatrix: [
            {
              shape: "q8_0 / q8_0",
              ctx: "32768",
              batch: "256 / 128",
              logic: "3 / 5",
              prompt: "469.77",
              decode: "17.76",
              verdict: "winner",
              notes: "Still the only practical default. Short code often came back fenced, and short non-code prompts could still empty out message.content."
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "32768",
              batch: "256 / 128",
              logic: "2 / 5",
              prompt: "537.96",
              decode: "20.14",
              verdict: "regressed",
              notes: "Faster, but lost a logic case and is no longer promotable."
            },
            {
              shape: "q8_0 / turbo3",
              ctx: "32768",
              batch: "256 / 128",
              logic: "2 / 5",
              prompt: "530.62",
              decode: "19.77",
              verdict: "regressed",
              notes: "Same story as turbo2: a little faster, not good enough."
            },
            {
              shape: "q8_0 / turbo4",
              ctx: "32768",
              batch: "256 / 128",
              logic: "2 / 5",
              prompt: "533.96",
              decode: "20.03",
              verdict: "regressed",
              notes: "No reason to keep this over the symmetric winner."
            },
            {
              shape: "q8_0 / q4_0",
              ctx: "32768",
              batch: "256 / 128",
              logic: "2 / 5",
              prompt: "391.03",
              decode: "17.56",
              verdict: "regressed",
              notes: "Coherent enough to finish, but worse quality and no speed upside."
            },
            {
              shape: "q4_0 / q8_0",
              ctx: "32768",
              batch: "256 / 128",
              logic: "0 / 5",
              prompt: "n/a",
              decode: "n/a",
              verdict: "corrupted",
              notes: "Repeated-token corruption."
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "32768",
              batch: "256 / 128",
              logic: "0 / 5",
              prompt: "n/a",
              decode: "n/a",
              verdict: "garbage",
              notes: "Fast but unusable."
            },
            {
              shape: "turbo2 / turbo2",
              ctx: "32768",
              batch: "256 / 128",
              logic: "0 / 5",
              prompt: "n/a",
              decode: "n/a",
              verdict: "not usable",
              notes: "Highest raw tok/s in the sweep, but the output quality collapsed."
            }
          ],
          longContext: [
            {
              shape: "q4_0 / q4_0",
              ctx: "65536",
              batch: "128 / 64",
              fitTarget: "0",
              prompt: "n/a",
              decode: "n/a",
              result: "CUDA OOM"
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "65536",
              batch: "128 / 64",
              fitTarget: "0",
              prompt: "n/a",
              decode: "n/a",
              result: "failed before a usable answer"
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "131072",
              batch: "64 / 32",
              fitTarget: "128",
              prompt: "106.86",
              decode: "2.15",
              result: "ingested about 80597 tokens, then decoded garbage"
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "131072",
              batch: "64 / 32",
              fitTarget: "128",
              prompt: "n/a",
              decode: "n/a",
              result: "CUDA OOM and wedged sidecar"
            },
            {
              shape: "turbo2 / turbo2",
              ctx: "131072",
              batch: "64 / 32",
              fitTarget: "128",
              prompt: "full prompt ingest",
              decode: "n/a",
              result: "hung after prompt processing and was manually aborted"
            }
          ],
          speculation: [
            {
              profile: "none",
              decode: "17.32",
              acceptance: "n/a",
              verdict: "baseline",
              notes: "Repeated code-rewrite bench without speculation."
            },
            {
              profile: "code-safe",
              decode: "17.66",
              acceptance: "n/a",
              verdict: "neutral",
              notes: "No meaningful win over baseline."
            },
            {
              profile: "code-fast",
              decode: "17.31",
              acceptance: "n/a",
              verdict: "neutral",
              notes: "Effectively identical to baseline."
            },
            {
              profile: "repeat",
              decode: "17.35",
              acceptance: "n/a",
              verdict: "neutral",
              notes: "No meaningful speedup."
            },
            {
              profile: "moe",
              decode: "17.33",
              acceptance: "n/a",
              verdict: "neutral",
              notes: "Also a wash."
            }
          ],
          edgeCases: [
            {
              test: "JSON mode",
              result: "fail",
              notes: "Returned fenced output instead of raw schema-clean JSON."
            },
            {
              test: "Tool calling",
              result: "fail",
              notes: "No tool calls were emitted in the edge harness."
            },
            {
              test: "Assistant prefill",
              result: "fail",
              notes: "Final content came back empty."
            },
            {
              test: "Reasoning parser",
              result: "pass",
              notes: "reasoning_content still parsed correctly."
            },
            {
              test: "Cache reuse",
              result: "pass",
              notes: "Prompt time dropped from about 19435.605 ms to about 110.447 ms with 12415 cached tokens."
            },
            {
              test: "Router sidecar",
              result: "risk",
              notes: "The kept alias answered, but a fresh router smoke still produced malformed visible content."
            }
          ]
        }
      ]
    },
    {
      id: "qwen36-35b-a3b-mxfp4-moe",
      name: "Qwen3.6 35B A3B MXFP4_MOE",
      shortName: "Qwen3.6 35B A3B",
      architecture: "Qwen3.6 / MoE / MXFP4_MOE",
      status: "Experimental but usable",
      source: "unsloth/Qwen3.6-35B-A3B-GGUF:MXFP4_MOE",
      summary:
        "The non-reasoning Qwen3.6 long-window aliases held up in the newer full rerun, so the live 262k and 524k presets stay on file unchanged. The family is strong for non-reasoning coding and chat, but reasoning and draftless speculation are still weak or broken on this branch.",
      highlights: [
        "The current 262k non-reasoning alias still looks like the safest conservative long-window preset on the 3060.",
        "The 524k YaRN non-reasoning alias also stayed strong on the rerun, so it remains worth keeping for the over-train lane.",
        "The rerun did not produce a clearly better replacement, so the live Qwen3.6 presets were intentionally left unchanged.",
        "Developer-role validation passed on both promoted non-reasoning aliases without a redownload, so the current local MXFP4_MOE blob is already the right one to keep.",
        "Reasoning output still empties final content, and draftless speculation is currently broken for this family."
      ],
      recommended: [
        {
          label: "Best non-reasoning default",
          value: "q8_0 / turbo2, ctx 262144, 16 / 16",
          supporting: "4 / 5 logic, about 86.79 / 31.81 on the rerun"
        },
        {
          label: "Best max-window alias on file",
          value: "q8_0 / turbo2, ctx 524288 + YaRN, 16 / 16",
          supporting: "4 / 5 logic, about 77.65 / 29.03"
        },
        {
          label: "Best short-prompt family lane",
          value: "q4_0 / q4_0, ctx 65536, 64 / 32",
          supporting: "4 / 5 logic, about 75.45 / 34.52"
        },
        {
          label: "Newest validation pass",
          value: "developer-role support works now",
          supporting: "262k and 524k non-reasoning aliases both obeyed a developer-role smoke cleanly"
        },
        {
          label: "Do not promote",
          value: "reasoning or draftless spec",
          supporting: "Reasoning returned empty content, and spec profiles hit Invalid input batch or asserts"
        }
      ],
      links: [
        { label: "Fusion Live Matrix", href: FUSION_LIVE_MATRIX_URL },
        { label: "Fusion Model Status", href: FUSION_MODEL_STATUS_URL }
      ],
      models: [
        {
          id: "qwen36-35b-a3b-mxfp4-moe-262k",
          name: "262k Non-Reasoning",
          size: "35B total / 3B active",
          status: "Experimental but usable",
          sourceFile: "Qwen3.6-35B-A3B-MXFP4_MOE.gguf",
          summary:
            "This is the best conservative long-window Qwen3.6 preset on file. The rerun kept it at 4 / 5 without exposing a cleaner replacement, and the newer developer-role validation passed on the same live alias without needing a redownload.",
          recommendedPreset: {
            alias: "qwen36-35b-a3b-unsloth-mxfp4-moe-262k",
            cache: "q8_0 / turbo2",
            context: "262144",
            batch: "16 / 16",
            fitTarget: "1024",
            logic: "4 / 5",
            promptTps: "86.79",
            decodeTps: "31.81",
            note: "Current live 262k non-reasoning alias. The rerun did not beat it cleanly enough to justify a preset change."
          },
          highlightMetrics: [
            {
              label: "Best 262k logic average",
              value: "86.79 / 31.81",
              note: "q8_0 / turbo2 at 262144 and 16 / 16"
            },
            {
              label: "Developer-role smoke",
              value: "DEV_OK",
              note: "Passed at about 77.92 / 46.11 without changing the local GGUF"
            },
            {
              label: "Closest 262k alternate",
              value: "86.98 / 31.13",
              note: "q8_0 / turbo3 matched 4 / 5, but still did not clearly beat turbo2"
            },
            {
              label: "Coding smoke",
              value: "82.28 / 32.16",
              note: "Developer-role coding prompt returned the correct add_two(x) function, fenced in markdown"
            }
          ],
          kvMatrix: [
            {
              shape: "q8_0 / turbo2",
              ctx: "262144",
              batch: "16 / 16",
              logic: "4 / 5",
              prompt: "86.79",
              decode: "31.81",
              verdict: "winner",
              notes: "Current live non-reasoning alias. Code smoke landed 83.50 / 30.27 and TCP smoke landed 85.96 / 32.12."
            },
            {
              shape: "q8_0 / turbo3",
              ctx: "262144",
              batch: "16 / 16",
              logic: "4 / 5",
              prompt: "86.98",
              decode: "31.13",
              verdict: "near tie",
              notes: "Better than older notes, but still not enough of a win to replace turbo2."
            },
            {
              shape: "q8_0 / turbo4",
              ctx: "262144",
              batch: "16 / 16",
              logic: "3 / 5",
              prompt: "85.42",
              decode: "30.57",
              verdict: "regressed",
              notes: "Still usable, but not good enough to promote."
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "65536",
              batch: "64 / 32",
              logic: "4 / 5",
              prompt: "75.45",
              decode: "34.52",
              verdict: "short-prompt winner",
              notes: "Family short-text winner, but not the long-window alias this tier is about."
            }
          ],
          longContext: [
            {
              shape: "q8_0 / turbo2",
              ctx: "262144",
              batch: "16 / 16",
              fitTarget: "1024",
              prompt: "86.79",
              decode: "31.81",
              result: "stable direct / logic pass"
            },
            {
              shape: "q8_0 / turbo3",
              ctx: "262144",
              batch: "16 / 16",
              fitTarget: "1024",
              prompt: "86.98",
              decode: "31.13",
              result: "stable alternative"
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "131072",
              batch: "32 / 16",
              fitTarget: "1024",
              prompt: "n/a",
              decode: "n/a",
              result: "rerun unresolved"
            }
          ],
          speculation: [
            {
              profile: "none",
              decode: "33.86",
              acceptance: "n/a",
              verdict: "baseline",
              notes: "The plain q4_0 / q4_0 family spec bench stayed coherent."
            },
            {
              profile: "code-safe",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            },
            {
              profile: "code-fast",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            },
            {
              profile: "repeat",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            },
            {
              profile: "moe",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "crashes",
              notes: "Hit a hard assert in common_batch_add / llama_batch size exceeded."
            }
          ],
          edgeCases: [
            {
              test: "JSON mode",
              result: "fail",
              notes: "Family-wide edge harness still returned fenced JSON instead of raw schema-clean output."
            },
            {
              test: "Tool calling",
              result: "pass",
              notes: "Parsed one tool call cleanly: sum_numbers. A newer developer-role tool smoke on the 262k alias also emitted sum_numbers with arguments {\"a\":2,\"b\":3}."
            },
            {
              test: "Assistant prefill",
              result: "fail",
              notes: "Returned only a blank think block in the family edge harness."
            },
            {
              test: "Developer role",
              result: "pass",
              notes: "A direct developer-role smoke returned exactly DEV_OK at about 77.92 / 46.11, confirming the current local MXFP4_MOE blob already supports it."
            },
            {
              test: "Reasoning alias",
              result: "risk",
              notes: "Budgets 64, 256, and 512 all emitted reasoning_content but empty final content."
            },
            {
              test: "Cache reuse",
              result: "pass",
              notes: "Family edge harness dropped from about 207673.864 ms to about 499.392 ms with 12788 cached tokens."
            },
            {
              test: "Router sidecar",
              result: "pass",
              notes: "Private router smoke answered OK on the non-reasoning 262k alias."
            },
            {
              test: "TriAttention",
              result: "deferred",
              notes: "No local calibration file exists for this exact family."
            }
          ]
        },
        {
          id: "qwen36-35b-a3b-mxfp4-moe-524k",
          name: "524k YaRN Non-Reasoning",
          size: "35B total / 3B active",
          status: "Experimental but usable",
          sourceFile: "Qwen3.6-35B-A3B-MXFP4_MOE.gguf",
          summary:
            "This is the over-train long-window Qwen3.6 lane worth keeping on file. The newer rerun confirmed that the existing 524k YaRN alias is still a real non-reasoning option on this card, and a direct developer-role smoke also passed on the same live alias.",
          recommendedPreset: {
            alias: "qwen36-35b-a3b-unsloth-mxfp4-moe-524k-yarn",
            cache: "q8_0 / turbo2",
            context: "524288",
            batch: "16 / 16",
            fitTarget: "1024",
            logic: "4 / 5",
            promptTps: "77.65",
            decodeTps: "29.03",
            note: "Current live 524k YaRN non-reasoning alias. The rerun supported keeping it as-is."
          },
          highlightMetrics: [
            {
              label: "Best 524k logic average",
              value: "77.65 / 29.03",
              note: "q8_0 / turbo2 with explicit YaRN at 524288 and 16 / 16"
            },
            {
              label: "Developer-role smoke",
              value: "DEV_OK",
              note: "Passed at about 67.84 / 41.29 on the live 524k YaRN alias"
            },
            {
              label: "Code smoke",
              value: "75.32 / 29.64",
              note: "Still solid even in the doubled-window configuration"
            },
            {
              label: "Main caveat",
              value: "not a reasoning lane",
              note: "The family reasoning path still empties final content, so this tier stays non-reasoning only"
            }
          ],
          kvMatrix: [
            {
              shape: "q8_0 / turbo2 + YaRN",
              ctx: "524288",
              batch: "16 / 16",
              logic: "4 / 5",
              prompt: "77.65",
              decode: "29.03",
              verdict: "winner",
              notes: "Current live over-train alias. TCP smoke landed 76.64 / 29.31."
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "262144",
              batch: "16 / 16",
              logic: "4 / 5",
              prompt: "86.79",
              decode: "31.81",
              verdict: "native-window reference",
              notes: "Still the safer native-window comparison point."
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "65536",
              batch: "64 / 32",
              logic: "4 / 5",
              prompt: "75.45",
              decode: "34.52",
              verdict: "short-prompt reference",
              notes: "Short family winner for users who do not need the extreme window."
            }
          ],
          longContext: [
            {
              shape: "q8_0 / turbo2 + YaRN",
              ctx: "524288",
              batch: "16 / 16",
              fitTarget: "1024",
              prompt: "77.65",
              decode: "29.03",
              result: "validated direct / logic pass"
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "262144",
              batch: "16 / 16",
              fitTarget: "1024",
              prompt: "86.79",
              decode: "31.81",
              result: "native-window baseline"
            },
            {
              shape: "q8_0 / turbo2 + YaRN",
              ctx: "524288",
              batch: "16 / 16",
              fitTarget: "1024",
              prompt: "n/a",
              decode: "n/a",
              result: "full retrieval still unresolved"
            }
          ],
          speculation: [
            {
              profile: "none",
              decode: "29.03",
              acceptance: "n/a",
              verdict: "baseline",
              notes: "Keep this tier plain. The family draftless spec paths are broken."
            },
            {
              profile: "code-safe",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Family-wide spec issue: Invalid input batch."
            },
            {
              profile: "code-fast",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Family-wide spec issue: Invalid input batch."
            },
            {
              profile: "repeat",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Family-wide spec issue: Invalid input batch."
            },
            {
              profile: "moe",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "crashes",
              notes: "Family-wide spec issue: hard assert."
            }
          ],
          edgeCases: [
            {
              test: "JSON mode",
              result: "fail",
              notes: "Family-wide edge harness still fences JSON."
            },
            {
              test: "Developer role",
              result: "pass",
              notes: "A direct developer-role smoke returned exactly DEV_OK at about 67.84 / 41.29 on the live 524k YaRN alias."
            },
            {
              test: "Tool calling",
              result: "pass",
              notes: "Family-wide tool calling is still good."
            },
            {
              test: "Assistant prefill",
              result: "fail",
              notes: "Family-wide prefill behavior remains weak."
            },
            {
              test: "Reasoning alias",
              result: "risk",
              notes: "Do not promote the matching reasoning alias; it returns empty final content."
            },
            {
              test: "Router sidecar",
              result: "pass",
              notes: "Private router smoke answered OK on the 524k YaRN non-reasoning alias."
            },
            {
              test: "Preset change after rerun",
              result: "pass",
              notes: "The rerun supported keeping the existing 524k alias as-is rather than replacing it."
            }
          ]
        }
      ]
    },
    {
      id: "qwen3-coder-30b-a3b-udq3kxl",
      name: "Qwen3 Coder 30B A3B UD-Q3_K_XL",
      shortName: "Qwen3 Coder 30B",
      architecture: "Qwen3 Coder / MoE",
      status: "Experimental but usable",
      source: "unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF:UD-Q3_K_XL",
      summary:
        "This UD-Q3_K_XL build is a strong coding-first family on the 3060, but the practical win came from a mixed q8_0 / turbo2 direct lane rather than a pure TurboQuant sweep. Draftless speculation on q4_0 / q4_0 is worth keeping, while long-context retrieval is still not honestly promoted.",
      highlights: [
        "q8_0 / turbo2 at 131072 and 64 / 32 matched the best logic score at 4 / 5 while clearly beating q8_0 / q8_0 on speed.",
        "q4_0 / q4_0 with code-safe is the best speculative lane, lifting decode to 55.70 tok/s while staying coherent.",
        "128 / 64 is not safe on this quant. The heavier q4_0 / q4_0 batch lane hit CUDA OOM and resource-allocation failures.",
        "Tool calling is solid, but strict JSON and assistant-prefill are weak. TriAttention was deferred because there is no local stats file for this exact family."
      ],
      recommended: [
        {
          label: "Best overall",
          value: "q8_0 / turbo2, ctx 131072, 64 / 32",
          supporting: "4 / 5 logic, code 67.05 / 33.84, logic average 84.32 / 34.56"
        },
        {
          label: "Best speculation lane",
          value: "q4_0 / q4_0 with code-safe",
          supporting: "Decode 55.70 vs 34.49 baseline, stayed coherent"
        },
        {
          label: "Best router-safe smoke",
          value: "plain alias plus q8_0 / turbo2 alt",
          supporting: "Both temporary router aliases answered OK in the private smoke"
        },
        {
          label: "Main caveat",
          value: "no promoted long-context retrieval lane yet",
          supporting: "131k retrieval failed, and the 262k rescue was only a partial ingest before manual stop"
        }
      ],
      links: [
        { label: "Fusion Live Matrix", href: FUSION_LIVE_MATRIX_URL },
        { label: "Fusion Model Status", href: FUSION_MODEL_STATUS_URL }
      ],
      models: [
        {
          id: "qwen3-coder-30b-a3b-udq3kxl-main",
          name: "UD-Q3_K_XL",
          size: "30.5B total / 3.3B active",
          status: "Experimental but usable",
          sourceFile: "Qwen3-Coder-30B-A3B-Instruct-UD-Q3_K_XL.gguf",
          summary:
            "This is the current coding-focused winner for the downloaded UD-Q3_K_XL file. The mixed q8_0 / turbo2 lane is the best balanced direct preset, while q4_0 / q4_0 is the right base when you want draftless speculation.",
          recommendedPreset: {
            alias: "qwen3-coder-30b-a3b-instruct-ud-q3kxl-q8t2",
            cache: "q8_0 / turbo2",
            context: "131072",
            batch: "64 / 32",
            fitTarget: "0",
            logic: "4 / 5",
            promptTps: "84.32",
            decodeTps: "34.56",
            note: "Best balanced direct preset from the full matrix. This alias name came from the router smoke harness, not a promoted live preset."
          },
          highlightMetrics: [
            {
              label: "Best direct logic average",
              value: "84.32 / 34.56",
              note: "q8_0 / turbo2 at 131072 and 64 / 32"
            },
            {
              label: "Best safe speculation decode",
              value: "55.70",
              note: "q4_0 / q4_0 with code-safe on the rewrite bench"
            },
            {
              label: "Best router smoke",
              value: "70.02 / 58.77",
              note: "Private router alias 1 answered OK"
            },
            {
              label: "Long-context outlook",
              value: "262144 partial rescue",
              note: "A q4_0 / q4_0 ingest started cleanly, but no completed retrieval pass is recorded yet"
            }
          ],
          kvMatrix: [
            {
              shape: "q8_0 / turbo2",
              ctx: "131072",
              batch: "64 / 32",
              logic: "4 / 5",
              prompt: "84.32",
              decode: "34.56",
              verdict: "winner",
              notes: "Best balanced lane. Code smoke landed 67.05 / 33.84 and TCP smoke landed 91.08 / 34.74."
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "131072",
              batch: "64 / 32",
              logic: "4 / 5",
              prompt: "66.59",
              decode: "27.92",
              verdict: "safe alternative",
              notes: "Matched the best logic score, but lost too much speed to beat q8_0 / turbo2."
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "131072",
              batch: "64 / 32",
              logic: "3 / 5",
              prompt: "94.78",
              decode: "33.70",
              verdict: "spec base",
              notes: "Strong prompt speed and the right base for code-safe speculation, but logic fell behind the winner."
            },
            {
              shape: "turbo4 / turbo4",
              ctx: "131072",
              batch: "64 / 32",
              logic: "3 / 5",
              prompt: "98.11",
              decode: "35.98",
              verdict: "faster but regressed",
              notes: "Fast, but quality dropped and it is not the lane to promote."
            },
            {
              shape: "q8_0 / turbo3",
              ctx: "131072",
              batch: "64 / 32",
              logic: "n/a",
              prompt: "n/a",
              decode: "n/a",
              verdict: "not usable",
              notes: "Completed matrix yielded empty outputs or otherwise unusable runs."
            },
            {
              shape: "q8_0 / turbo4",
              ctx: "131072",
              batch: "64 / 32",
              logic: "n/a",
              prompt: "n/a",
              decode: "n/a",
              verdict: "not usable",
              notes: "Did not produce a promotable completed run on this quant."
            },
            {
              shape: "turbo3 / turbo3",
              ctx: "131072",
              batch: "64 / 32",
              logic: "n/a",
              prompt: "n/a",
              decode: "n/a",
              verdict: "not usable",
              notes: "Bad lane on this model in the full matrix."
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "131072",
              batch: "128 / 64",
              logic: "n/a",
              prompt: "n/a",
              decode: "n/a",
              verdict: "CUDA OOM",
              notes: "The heavier batch shape is not safe on this quant."
            }
          ],
          longContext: [
            {
              shape: "q4_0 / q4_0",
              ctx: "131072",
              batch: "64 / 32",
              fitTarget: "0",
              prompt: "n/a",
              decode: "n/a",
              result: "failed retrieval"
            },
            {
              shape: "q8_0 / turbo3",
              ctx: "131072",
              batch: "64 / 32",
              fitTarget: "0",
              prompt: "n/a",
              decode: "n/a",
              result: "failed retrieval"
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "262144",
              batch: "32 / 16",
              fitTarget: "512",
              prompt: "active ingest",
              decode: "n/a",
              result: "partial rescue only"
            }
          ],
          speculation: [
            {
              profile: "none",
              decode: "34.49",
              acceptance: "n/a",
              verdict: "baseline",
              notes: "Repeated code-rewrite bench without speculation."
            },
            {
              profile: "code-safe",
              decode: "55.70",
              acceptance: "0.82846",
              verdict: "promote",
              notes: "Best safe decode gain and output stayed coherent."
            },
            {
              profile: "repeat",
              decode: "49.84",
              acceptance: "n/a",
              verdict: "usable",
              notes: "Strong gain, but still behind code-safe."
            },
            {
              profile: "code-fast",
              decode: "47.24",
              acceptance: "n/a",
              verdict: "usable",
              notes: "Faster than baseline, but not the best return."
            },
            {
              profile: "moe",
              decode: "47.01",
              acceptance: "n/a",
              verdict: "usable",
              notes: "Speedup exists, but code-safe remained the clear winner."
            }
          ],
          edgeCases: [
            {
              test: "JSON mode",
              result: "fail",
              notes: "Returned fenced JSON instead of raw schema-clean output."
            },
            {
              test: "Tool calling",
              result: "pass",
              notes: "Parsed one tool call cleanly: sum_numbers."
            },
            {
              test: "Assistant prefill",
              result: "fail",
              notes: "Returned only a weak continuation value instead of a clean prefilled completion."
            },
            {
              test: "Reasoning parser",
              result: "neutral",
              notes: "This matrix kept reasoning off, so there was no useful reasoning_content signal to score."
            },
            {
              test: "Cache reuse",
              result: "neutral",
              notes: "The edge harness did not yield usable reuse counters for this family in the recorded run."
            },
            {
              test: "Router sidecar",
              result: "pass",
              notes: "Private router smoke passed after switching the second alias to the safe q8_0 / turbo2 shape."
            },
            {
              test: "TriAttention",
              result: "deferred",
              notes: "No local calibration file exists for this exact family, so TriAttention was not run."
            }
          ]
        }
      ]
    },
    {
      id: "noctrex-qwen35-35b-a3b-opus46-mxfp4",
      name: "Qwen3.5 35B A3B Claude 4.6 Opus Reasoning Distilled MXFP4_MOE",
      shortName: "Noctrex Qwen3.5 35B",
      architecture: "Qwen3.5 / MoE / reasoning distill / MXFP4_MOE",
      status: "Experimental but usable",
      source: "noctrex/Qwen3.5-35B-A3B-Claude-4.6-Opus-Reasoning-Distilled-MXFP4_MOE-GGUF:MXFP4_MOE",
      summary:
        "This Noctrex Qwen3.5 distill is usable on the 3060, but its best lanes are narrower than the Qwen3.6 family. The honest default is still symmetric q4_0 / q4_0 at 65k, the best 262k direct lane is q8_0 / turbo3, and the only real 100k-plus retrieval pass came from q8_0 / turbo2 at 131k.",
      highlights: [
        "q4_0 / q4_0 at 65536 and 64 / 32 is the best balanced direct preset, landing 4 / 5 while staying clean on code and TCP smokes.",
        "Among the short mixed lanes, q8_0 / turbo4 is the only one that also held 4 / 5; turbo2 and turbo3 both regressed to 3 / 5.",
        "At 262k direct context, q8_0 / turbo3 is the best lane on file, beating q8_0 / q8_0 on speed while keeping 4 / 5.",
        "Reasoning, draftless speculation, and router promotion are all weak on this family in the current build."
      ],
      recommended: [
        {
          label: "Best overall",
          value: "q4_0 / q4_0, ctx 65536, 64 / 32",
          supporting: "4 / 5 logic, code 67.95 / 35.92, logic average 80.87 / 34.93"
        },
        {
          label: "Best short mixed lane",
          value: "q8_0 / turbo4, ctx 65536, 64 / 32",
          supporting: "4 / 5 logic, code 72.76 / 36.05, TCP 70.29 / 36.22"
        },
        {
          label: "Best 262k direct lane",
          value: "q8_0 / turbo3, ctx 262144, 16 / 16",
          supporting: "4 / 5 logic, code 86.91 / 31.44, logic average 91.32 / 30.72"
        },
        {
          label: "Best real long retrieval",
          value: "q8_0 / turbo2, ctx 131072, 32 / 16",
          supporting: "118568 prompt tokens, retrieval pass at 82.90 / 14.84"
        },
        {
          label: "Main caveat",
          value: "reasoning, spec, and router are not promotable",
          supporting: "Reasoning emptied final content, spec hit Invalid input batch or asserts, and router smoke returned empty visible content"
        }
      ],
      links: [
        { label: "Fusion Live Matrix", href: FUSION_LIVE_MATRIX_URL },
        { label: "Fusion Model Status", href: FUSION_MODEL_STATUS_URL }
      ],
      models: [
        {
          id: "noctrex-qwen35-35b-a3b-opus46-mxfp4-main",
          name: "MXFP4_MOE",
          size: "35B total / 3B active",
          status: "Experimental but usable",
          sourceFile: "Qwen3.5-35B-A3B-Claude-4.6-Opus-Reasoning-Distilled-MXFP4_MOE.gguf",
          summary:
            "This staged Noctrex MXFP4_MOE file has one clean 65k winner and one real 131k retrieval rescue lane, but the rest of the advanced fusion features are mixed. Keep it as a documented experimental family rather than a live promoted default.",
          recommendedPreset: {
            alias: "staged only / not promoted live yet",
            cache: "q4_0 / q4_0",
            context: "65536",
            batch: "64 / 32",
            fitTarget: "0",
            logic: "4 / 5",
            promptTps: "80.87",
            decodeTps: "34.93",
            note: "Best balanced direct preset from the full matrix. The family is not wired live yet because reasoning, spec, and router still need work."
          },
          highlightMetrics: [
            {
              label: "Best direct logic average",
              value: "80.87 / 34.93",
              note: "q4_0 / q4_0 at 65536 and 64 / 32"
            },
            {
              label: "Best short mixed lane",
              value: "78.83 / 34.50",
              note: "q8_0 / turbo4 at 65536 and 64 / 32"
            },
            {
              label: "Best 262k direct lane",
              value: "91.32 / 30.72",
              note: "q8_0 / turbo3 at 262144 and 16 / 16"
            },
            {
              label: "Best long retrieval",
              value: "118568 prompt tokens",
              note: "q8_0 / turbo2 at 131072 and 32 / 16 passed at 82.90 / 14.84"
            }
          ],
          kvMatrix: [
            {
              shape: "q4_0 / q4_0",
              ctx: "65536",
              batch: "64 / 32",
              logic: "4 / 5",
              prompt: "80.87",
              decode: "34.93",
              verdict: "winner",
              notes: "Best balanced lane. Code smoke landed 67.95 / 35.92 and TCP smoke landed 66.42 / 36.54."
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "65536",
              batch: "64 / 32",
              logic: "4 / 5",
              prompt: "77.50",
              decode: "34.64",
              verdict: "safe alternative",
              notes: "Stayed clean and matched the logic score, but did not beat the symmetric q4_0 / q4_0 winner."
            },
            {
              shape: "q8_0 / turbo4",
              ctx: "65536",
              batch: "64 / 32",
              logic: "4 / 5",
              prompt: "78.83",
              decode: "34.50",
              verdict: "best mixed short lane",
              notes: "The only mixed 65k lane that also held 4 / 5."
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "65536",
              batch: "64 / 32",
              logic: "3 / 5",
              prompt: "79.25",
              decode: "34.33",
              verdict: "regressed",
              notes: "A little faster on some prompts, but lost a logic case."
            },
            {
              shape: "q8_0 / turbo3",
              ctx: "65536",
              batch: "64 / 32",
              logic: "3 / 5",
              prompt: "78.75",
              decode: "34.85",
              verdict: "regressed",
              notes: "Coherent, but not good enough to promote at 65k."
            },
            {
              shape: "q8_0 / turbo3",
              ctx: "262144",
              batch: "16 / 16",
              logic: "4 / 5",
              prompt: "91.32",
              decode: "30.72",
              verdict: "best 262k direct",
              notes: "Best direct 262k lane on file. Code smoke landed 86.91 / 31.44 and TCP smoke landed 85.13 / 31.22."
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "262144",
              batch: "16 / 16",
              logic: "4 / 5",
              prompt: "86.39",
              decode: "29.47",
              verdict: "safe 262k alternative",
              notes: "Matched the logic score, but slower than q8_0 / turbo3."
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "262144",
              batch: "16 / 16",
              logic: "2 / 5",
              prompt: "90.80",
              decode: "30.78",
              verdict: "not promotable",
              notes: "Fast enough, but quality regressed too hard in the direct 262k lane."
            },
            {
              shape: "q8_0 / turbo4",
              ctx: "262144",
              batch: "16 / 16",
              logic: "2 / 5",
              prompt: "89.77",
              decode: "30.67",
              verdict: "not promotable",
              notes: "Another fast-but-regressed 262k lane."
            }
          ],
          longContext: [
            {
              shape: "q8_0 / turbo2",
              ctx: "131072",
              batch: "32 / 16",
              fitTarget: "1024",
              prompt: "82.90",
              decode: "14.84",
              result: "retrieval pass at 118568 prompt tokens"
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "131072",
              batch: "64 / 32",
              fitTarget: "0",
              prompt: "n/a",
              decode: "n/a",
              result: "CUDA OOM around 31 percent prompt progress"
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "262144",
              batch: "32 / 16",
              fitTarget: "512",
              prompt: "n/a",
              decode: "n/a",
              result: "failed near 80 percent prefill with no usable answer"
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "262144",
              batch: "16 / 16",
              fitTarget: "1024",
              prompt: "n/a",
              decode: "n/a",
              result: "failed near 75 percent prefill with no usable answer"
            }
          ],
          speculation: [
            {
              profile: "none",
              decode: "34.43",
              acceptance: "n/a",
              verdict: "baseline",
              notes: "Repeated code-rewrite bench without speculation on the q4_0 / q4_0 winner."
            },
            {
              profile: "code-safe",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            },
            {
              profile: "code-fast",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            },
            {
              profile: "repeat",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            },
            {
              profile: "moe",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "crashes",
              notes: "Hit a hard assert and request failure in the draftless MoE path."
            }
          ],
          edgeCases: [
            {
              test: "JSON mode",
              result: "fail",
              notes: "Returned fenced JSON instead of raw schema-clean output."
            },
            {
              test: "Tool calling",
              result: "pass",
              notes: "Parsed one tool call cleanly: sum_numbers."
            },
            {
              test: "Assistant prefill",
              result: "fail",
              notes: "Returned a weak think block and then the answer prefix instead of a clean continuation."
            },
            {
              test: "Reasoning parser",
              result: "risk",
              notes: "Budgets 64, 256, and 512 all produced reasoning_content but empty final content."
            },
            {
              test: "Cache reuse",
              result: "pass",
              notes: "Prompt time dropped from 183767.862 ms to 473.029 ms with 12787 cached tokens."
            },
            {
              test: "Router sidecar",
              result: "risk",
              notes: "Private router smoke completed, but all three temporary aliases returned empty visible content."
            },
            {
              test: "TriAttention",
              result: "deferred",
              notes: "No local calibration file exists for this exact family."
            }
          ]
        }
      ]
    },
    {
      id: "qwopus-glm-18b-q4km",
      name: "Qwopus GLM 18B Merged Q4_K_M",
      shortName: "Qwopus GLM 18B",
      architecture: "Qwen3.5 hybrid merge / Q4_K_M",
      status: "Experimental but usable",
      source: "KyleHessling1/Qwopus-GLM-18B-Merged-GGUF:Q4_K_M",
      summary:
        "This merge looks more like a qwen35 hybrid family than a native GLM lane in practice. It is usable as a medium-context text model on the 3060, but it is not a serious promotion candidate for reasoning, structured output, speculation, router mode, or long-context work.",
      highlights: [
        "Under the hood this GGUF is qwen35, not glm4, and it exposes think tags by default.",
        "The only honest short lanes are q8_0 / q8_0 and q8_0 / turbo2 at 65536, both landing 3 / 5.",
        "At 262k direct context, q8_0 / turbo2 is still the least-bad lane, but throughput collapses to about 28.40 / 7.03.",
        "Reasoning emits traces but no final content, draftless speculation is broken, and all temporary router aliases returned empty visible content."
      ],
      recommended: [
        {
          label: "Best short safe lane",
          value: "q8_0 / q8_0, ctx 65536, 64 / 32",
          supporting: "3 / 5 logic, code 277.25 / 27.85, logic average 293.79 / 27.71"
        },
        {
          label: "Closest mixed alt",
          value: "q8_0 / turbo2, ctx 65536, 64 / 32",
          supporting: "3 / 5 logic, code 275.86 / 27.55, logic average 292.88 / 27.63"
        },
        {
          label: "Best direct 262k lane",
          value: "q8_0 / turbo2, ctx 262144, 16 / 16",
          supporting: "3 / 5 logic, code 27.81 / 7.12, logic average 28.40 / 7.03"
        },
        {
          label: "Strongest edge-case win",
          value: "cache reuse and tool calling",
          supporting: "Prompt time dropped from 28785.653 ms to 157.438 ms, and sum_numbers parsed cleanly"
        },
        {
          label: "Main caveat",
          value: "medium-context text only",
          supporting: "Reasoning, draftless spec, router mode, and 131k-plus long context are all non-promotable here"
        }
      ],
      links: [
        { label: "Fusion Live Matrix", href: FUSION_LIVE_MATRIX_URL },
        { label: "Fusion Model Status", href: FUSION_MODEL_STATUS_URL }
      ],
      models: [
        {
          id: "qwopus-glm-18b-q4km-main",
          name: "Q4_K_M",
          size: "18B merged",
          status: "Experimental but usable",
          sourceFile: "Qwopus-GLM-18B-Healed-Q4_K_M.gguf",
          summary:
            "Keep this one documented as a medium-context experiment. It can answer normal coding and TCP smoke prompts cleanly, but its logic score caps out at 3 / 5 and the advanced fusion features are mostly cautionary rather than promotable.",
          recommendedPreset: {
            alias: "staged only / not promoted live yet",
            cache: "q8_0 / q8_0",
            context: "65536",
            batch: "64 / 32",
            fitTarget: "0",
            logic: "3 / 5",
            promptTps: "293.79",
            decodeTps: "27.71",
            note: "Best short safe lane from the full matrix. q8_0 / turbo2 is essentially tied if you want the mixed cache variant."
          },
          highlightMetrics: [
            {
              label: "Best short logic average",
              value: "293.79 / 27.71",
              note: "q8_0 / q8_0 at 65536 and 64 / 32"
            },
            {
              label: "Best direct 262k lane",
              value: "28.40 / 7.03",
              note: "q8_0 / turbo2 at 262144 and 16 / 16"
            },
            {
              label: "Best edge-case win",
              value: "157.438 ms second prompt",
              note: "Cache reuse with 12787 cached tokens"
            },
            {
              label: "Practical ceiling",
              value: "65536 ctx",
              note: "The 131k and 262k long-context rescues were not promotable on this 3060"
            }
          ],
          kvMatrix: [
            {
              shape: "q8_0 / q8_0",
              ctx: "65536",
              batch: "64 / 32",
              logic: "3 / 5",
              prompt: "293.79",
              decode: "27.71",
              verdict: "winner",
              notes: "Best short safe lane. Code smoke landed 277.25 / 27.85 and TCP smoke landed 212.20 / 27.84."
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "65536",
              batch: "64 / 32",
              logic: "3 / 5",
              prompt: "292.88",
              decode: "27.63",
              verdict: "near tie",
              notes: "Essentially tied with the symmetric winner and still the best mixed short lane."
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "65536",
              batch: "64 / 32",
              logic: "2 / 5",
              prompt: "293.25",
              decode: "27.56",
              verdict: "regressed",
              notes: "Fast enough, but quality slipped too far."
            },
            {
              shape: "q8_0 / turbo3",
              ctx: "65536",
              batch: "64 / 32",
              logic: "2 / 5",
              prompt: "293.45",
              decode: "27.58",
              verdict: "regressed",
              notes: "No upside over the q8_0 / q8_0 or q8_0 / turbo2 short lanes."
            },
            {
              shape: "q8_0 / turbo4",
              ctx: "65536",
              batch: "64 / 32",
              logic: "2 / 5",
              prompt: "293.17",
              decode: "27.50",
              verdict: "regressed",
              notes: "Same story as turbo3: no reason to promote it."
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "262144",
              batch: "16 / 16",
              logic: "3 / 5",
              prompt: "28.40",
              decode: "7.03",
              verdict: "best 262k direct",
              notes: "Least-bad direct 262k lane, but throughput collapses hard."
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "262144",
              batch: "16 / 16",
              logic: "2 / 5",
              prompt: "21.21",
              decode: "5.64",
              verdict: "too slow and weaker",
              notes: "Worse than q8_0 / turbo2 on both quality and speed."
            },
            {
              shape: "q8_0 / turbo3",
              ctx: "262144",
              batch: "16 / 16",
              logic: "2 / 5",
              prompt: "28.26",
              decode: "6.87",
              verdict: "regressed",
              notes: "Speed stayed close to turbo2, but quality fell to 2 / 5."
            },
            {
              shape: "q8_0 / turbo4",
              ctx: "262144",
              batch: "16 / 16",
              logic: "2 / 5",
              prompt: "25.21",
              decode: "6.46",
              verdict: "regressed",
              notes: "No reason to keep this over the direct 262k turbo2 lane."
            }
          ],
          longContext: [
            {
              shape: "q4_0 / q4_0",
              ctx: "131072",
              batch: "64 / 32",
              fitTarget: "0",
              prompt: "n/a",
              decode: "n/a",
              result: "CUDA OOM at about 85.99 percent prompt progress"
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "131072",
              batch: "128 / 64",
              fitTarget: "0",
              prompt: "n/a",
              decode: "n/a",
              result: "CUDA OOM at about 21.27 percent prompt progress"
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "262144",
              batch: "128 / 64",
              fitTarget: "128",
              prompt: "n/a",
              decode: "n/a",
              result: "aborted as impractical near 21.54 percent prompt progress at about 11.85 GiB VRAM"
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "262144",
              batch: "128 / 64",
              fitTarget: "128",
              prompt: "n/a",
              decode: "n/a",
              result: "not attempted after the q4_0 / q4_0 262k rescue proved clearly impractical"
            }
          ],
          speculation: [
            {
              profile: "none",
              decode: "26.79",
              acceptance: "n/a",
              verdict: "baseline failed",
              notes: "The repeated code-rewrite spec bench already came back incoherent or empty."
            },
            {
              profile: "code-safe",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            },
            {
              profile: "code-fast",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            },
            {
              profile: "repeat",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            },
            {
              profile: "moe",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "crashes",
              notes: "Hit the same hard assert / llama_batch size exceeded path as other broken spec families."
            }
          ],
          edgeCases: [
            {
              test: "JSON mode",
              result: "fail",
              notes: "Returned fenced JSON instead of raw schema-clean output."
            },
            {
              test: "Tool calling",
              result: "pass",
              notes: "Parsed one tool call cleanly: sum_numbers."
            },
            {
              test: "Assistant prefill",
              result: "fail",
              notes: "Leaked think text before the answer instead of producing a clean continuation."
            },
            {
              test: "Reasoning parser",
              result: "risk",
              notes: "Budgets 64, 256, and 512 all produced reasoning_content but empty final content."
            },
            {
              test: "Cache reuse",
              result: "pass",
              notes: "Prompt time dropped from 28785.653 ms to 157.438 ms with 12787 cached tokens."
            },
            {
              test: "Router sidecar",
              result: "risk",
              notes: "All three temporary aliases returned empty visible content, even though the reasoning alias emitted a reasoning trace."
            },
            {
              test: "TriAttention",
              result: "deferred",
              notes: "No local calibration file exists for this exact family."
            }
          ]
        }
      ]
    },
    {
      id: "qwen35-glm51-i1",
      name: "Qwen3.5 9B GLM5.1 Distill v1 i1",
      shortName: "Qwen3.5 9B GLM5.1",
      architecture: "Qwen3.5 hybrid recurrent / GLM5.1 distill",
      status: "Experimental but usable",
      source: "mradermacher/Qwen3.5-9B-GLM5.1-Distill-v1-i1-GGUF",
      summary:
        "This family is a real long-context hybrid on the 3060, but it still inherits the recurrent-context speculation and reasoning limits. The promoted keep is now Q4_K_M, not IQ4_NL.",
      highlights: [
        "Q4_K_M improved the direct winners from 3 / 5 to 4 / 5 relative to the IQ4_NL run.",
        "The old semantic_interference failure is gone on the promoted Q4_K_M lanes; only vowels_i_count still fails.",
        "The best practical long lane is q8_0 / q8_0 at 131072 and 128 / 64.",
        "262k retrieval is real on both q8_0 / turbo2 and q4_0 / q4_0, but decode still collapses too far to recommend it as a live default."
      ],
      recommended: [
        {
          label: "Best short default",
          value: "Q4_K_M, q8_0 / turbo2, ctx 65536, 256 / 128",
          supporting: "4 / 5 logic, code smoke 703.42 / 51.58"
        },
        {
          label: "Best long practical lane",
          value: "Q4_K_M, q8_0 / q8_0, ctx 131072, 128 / 64",
          supporting: "Retrieval pass at 832.73 / 20.87"
        },
        {
          label: "Do not promote",
          value: "262k retrieval lanes",
          supporting: "Real passes, but only about 12.48 to 12.89 decode tok/s"
        },
        {
          label: "Family comparison",
          value: "Prefer Q4_K_M over IQ4_NL",
          supporting: "Lower raw short speed, clearly better coherence"
        }
      ],
      links: [
        { label: "Fusion Live Matrix", href: FUSION_LIVE_MATRIX_URL },
        { label: "Fusion Model Status", href: FUSION_MODEL_STATUS_URL }
      ],
      models: [
        {
          id: "qwen35-glm51-i1-q4km",
          name: "i1 Q4_K_M",
          size: "9B",
          status: "Experimental but usable",
          sourceFile: "Qwen3.5-9B-GLM5.1-Distill-v1.i1-Q4_K_M.gguf",
          summary:
            "This is the current keep for the family. It trades a little short-path speed for a real coherence gain over IQ4_NL while preserving the usable 131k long-context lane.",
          recommendedPreset: {
            alias: "qwen35-9b-glm51-distill-v1-i1-q4km",
            cache: "q8_0 / turbo2",
            context: "65536",
            batch: "256 / 128",
            fitTarget: "0",
            logic: "4 / 5",
            promptTps: "703.42",
            decodeTps: "51.58",
            note: "Best short direct default. The only remaining hidden-answer miss is vowels_i_count."
          },
          highlightMetrics: [
            {
              label: "Best short logic winner",
              value: "4 / 5",
              note: "q8_0 / turbo2 at 65536 and 256 / 128"
            },
            {
              label: "Best long practical lane",
              value: "832.73 / 20.87",
              note: "q8_0 / q8_0 at 131072 and 128 / 64"
            },
            {
              label: "Best real 262k pass",
              value: "622.62 / 12.89",
              note: "q4_0 / q4_0 at 262144 and 128 / 64"
            },
            {
              label: "Main improvement over IQ4_NL",
              value: "semantic_interference fixed",
              note: "Winner lanes now only miss vowels_i_count"
            }
          ],
          kvMatrix: [
            {
              shape: "q8_0 / turbo2",
              ctx: "65536",
              batch: "256 / 128",
              logic: "4 / 5",
              prompt: "815.65",
              decode: "50.85",
              verdict: "winner",
              notes: "Best short default. Code smoke landed 703.42 / 51.58 and TCP smoke landed 551.28 / 51.49."
            },
            {
              shape: "q8_0 / turbo4",
              ctx: "65536",
              batch: "256 / 128",
              logic: "4 / 5",
              prompt: "815.34",
              decode: "50.60",
              verdict: "co-winner",
              notes: "Nearly tied with turbo2, but turbo2 is the safer recommendation."
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "65536",
              batch: "256 / 128",
              logic: "3 / 5",
              prompt: "821.86",
              decode: "51.06",
              verdict: "safe symmetric fallback",
              notes: "Less accurate than the turbo2 short winner, but still useful as the long-lane sibling."
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "65536",
              batch: "256 / 128",
              logic: "3 / 5",
              prompt: "823.03",
              decode: "51.08",
              verdict: "faster ingest fallback",
              notes: "Coherent, but still behind the 4 / 5 mixed winners."
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "262144",
              batch: "128 / 64",
              logic: "4 / 5",
              prompt: "743.43",
              decode: "51.01",
              verdict: "best direct 262k profile",
              notes: "Strongest symmetric direct lane and the best setup to carry into the practical 131k recommendation."
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "262144",
              batch: "128 / 64",
              logic: "4 / 5",
              prompt: "742.23",
              decode: "50.94",
              verdict: "strong mixed 262k profile",
              notes: "Very close to q8_0 / q8_0, but not better enough to replace it as the long-lane recommendation."
            },
            {
              shape: "q8_0 / turbo4",
              ctx: "262144",
              batch: "128 / 64",
              logic: "4 / 5",
              prompt: "740.53",
              decode: "50.56",
              verdict: "usable",
              notes: "Coherent, but still behind q8_0 / q8_0 and q8_0 / turbo2."
            },
            {
              shape: "q8_0 / turbo3",
              ctx: "65536 to 262144",
              batch: "256 / 128 or 128 / 64",
              logic: "3 / 5",
              prompt: "816.30 to 742.64",
              decode: "50.83 to 50.76",
              verdict: "demote",
              notes: "Still behind the winning lanes on quality."
            }
          ],
          longContext: [
            {
              shape: "q8_0 / turbo2",
              ctx: "131072",
              batch: "128 / 64",
              fitTarget: "0",
              prompt: "823.44",
              decode: "19.86",
              result: "retrieval pass, slightly below the practical floor"
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "131072",
              batch: "128 / 64",
              fitTarget: "0",
              prompt: "832.73",
              decode: "20.87",
              result: "best practical long winner"
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "131072",
              batch: "128 / 64",
              fitTarget: "0",
              prompt: "845.27",
              decode: "20.50",
              result: "retrieval pass"
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "262144",
              batch: "128 / 64",
              fitTarget: "128",
              prompt: "600.88",
              decode: "12.48",
              result: "retrieval pass, not practical"
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "262144",
              batch: "128 / 64",
              fitTarget: "128",
              prompt: "622.62",
              decode: "12.89",
              result: "retrieval pass, not practical"
            }
          ],
          speculation: [
            {
              profile: "none",
              decode: "49.33",
              acceptance: "n/a",
              verdict: "baseline incoherent",
              notes: "The repeated code-rewrite spec bench was still not coherent before any speculative preset was applied."
            },
            {
              profile: "code-safe",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            },
            {
              profile: "code-fast",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            },
            {
              profile: "repeat",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            },
            {
              profile: "moe",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with the same Invalid input batch recurrent-context path."
            }
          ],
          edgeCases: [
            {
              test: "JSON mode",
              result: "fail",
              notes: "Returned fenced JSON instead of raw schema-clean output."
            },
            {
              test: "Tool calling",
              result: "pass",
              notes: "Parsed one tool call cleanly: sum_numbers."
            },
            {
              test: "Assistant prefill",
              result: "fail",
              notes: "Still leaked think text before the final answer."
            },
            {
              test: "Reasoning parser",
              result: "risk",
              notes: "Budgets 64, 256, and 512 all produced reasoning_content but empty final content."
            },
            {
              test: "Cache reuse",
              result: "pass",
              notes: "Prompt time dropped from 8857.664 ms to 43.678 ms with 12819 cached tokens."
            },
            {
              test: "Router sidecar",
              result: "risk",
              notes: "Temporary aliases loaded, but visible content still came back empty."
            },
            {
              test: "Family comparison",
              result: "pass",
              notes: "Q4_K_M is the better keep over IQ4_NL because the winner lanes moved from 3 / 5 to 4 / 5."
            }
          ]
        }
      ]
    },
    {
      id: "gemma-4-26b-a4b-mxfp4-moe",
      name: "Gemma 4 26B A4B IT MXFP4 MoE",
      shortName: "Gemma 4 MXFP4",
      architecture: "Gemma 4 / MXFP4 MoE / vision-capable",
      status: "Experimental but usable",
      source: "noctrex/gemma-4-26B-A4B-it-MXFP4_MOE-GGUF",
      summary:
        "This is the new staged Gemma 4 MXFP4 family with the BF16 projector. The short and native-262k direct sweeps are already better than expected, speculation is real, and the finished 131k retrieval tranche split cleanly between one pass, one OOM, and one interrupted run, but reasoning is still broken and the 262k to 393k retrieval extensions are not finished yet.",
      highlights: [
        "All finished short direct lanes except turbo3 / turbo3 landed 4 / 5 on the hidden-answer suite.",
        "The current best finished short lane is q4_0 / q4_0 at 65536 and 64 / 16, around 99.07 / 31.90 on the code smoke.",
        "The best finished native 262k direct lane is turbo4 / turbo4 at 262144 and 32 / 16, around 82.58 / 28.31.",
        "The first completed 131k retrieval pass is q8_0 / q8_0 at 32 / 16 and fit-target 1536, landing 120179 prompt tokens at about 81.25 / 18.01.",
        "q8_0 / turbo2 OOMed near 95 percent prefill at 131k, and q4_0 / q4_0 was interrupted mid-ingest before it produced a verdict.",
        "Draftless code-safe speculation is strong on q8_0 / q8_0, lifting decode to 63.25 tok/s while staying coherent.",
        "The BF16 mmproj needed extra fit headroom; the first pass OOMed until the matrix was relaunched with larger fit-target reserves, and most 262k fit-target 1024 lanes still failed after that.",
        "Reasoning still is not promotable because reasoning_content exists but final visible content comes back empty."
      ],
      recommended: [
        {
          label: "Best finished short direct lane",
          value: "q4_0 / q4_0, ctx 65536, 64 / 16",
          supporting: "4 / 5 logic, code smoke 99.07 / 31.90, TCP smoke 97.74 / 32.21"
        },
        {
          label: "Best finished native 262k lane",
          value: "turbo4 / turbo4, ctx 262144, 32 / 16",
          supporting: "4 / 5 logic, code smoke 82.58 / 28.31, TCP smoke 81.26 / 28.31"
        },
        {
          label: "Best finished 131k retrieval lane",
          value: "q8_0 / q8_0, ctx 131072, 32 / 16",
          supporting: "Needle retrieval pass at 120179 prompt tokens, around 81.25 / 18.01"
        },
        {
          label: "Best fast-path speculation",
          value: "q8_0 / q8_0 with code-safe",
          supporting: "63.25 decode tok/s with about 0.92571 draft acceptance"
        },
        {
          label: "Current blocker before promotion",
          value: "Reasoning and the larger retrieval ladder are still unresolved",
          supporting: "Reasoning returns empty final content, and only the first 131k tranche is finished so far"
        }
      ],
      links: [
        { label: "Fusion Live Matrix", href: FUSION_LIVE_MATRIX_URL },
        { label: "Fusion Model Status", href: FUSION_MODEL_STATUS_URL }
      ],
      models: [
        {
          id: "gemma-4-26b-a4b-mxfp4-moe-main",
          name: "Gemma 4 26B A4B IT MXFP4 MoE",
          size: "26B total / 4B active",
          status: "Experimental but usable",
          sourceFile: "gemma-4-26B-A4B-it-MXFP4_MOE.gguf + gemma-4-26B-A4B-it-mmproj-BF16.gguf",
          summary:
            "The direct, speculative, and first 131k retrieval results are already useful on the 3060, but this family is not ready for a live alias yet because the reasoning path is broken and the larger 262k to 393k retrieval / extension sections are not finished.",
          recommendedPreset: {
            alias: "staging only, no live router alias yet",
            cache: "q4_0 / q4_0",
            context: "65536",
            batch: "64 / 16",
            fitTarget: "1536",
            logic: "4 / 5",
            promptTps: "99.07",
            decodeTps: "31.90",
            note: "Best finished short direct lane so far. The live matrix was relaunched with extra projector headroom after the first BF16 mmproj OOM."
          },
          highlightMetrics: [
            {
              label: "Best short direct winner",
              value: "99.07 / 31.90",
              note: "q4_0 / q4_0 at 65536 and 64 / 16 on the code smoke"
            },
            {
              label: "Best finished native 262k direct lane",
              value: "82.58 / 28.31",
              note: "turbo4 / turbo4 at 262144 and 32 / 16"
            },
            {
              label: "Best speculation decode",
              value: "63.25",
              note: "q8_0 / q8_0 with code-safe"
            },
            {
              label: "Most important runtime fix",
              value: "fit-target rescue",
              note: "The BF16 projector OOMed until short and long lanes were relaunched with larger fit-target reserves, and only q8_0 / turbo4 still completed at 262k with fit-target 1024"
            }
          ],
          kvMatrix: [
            {
              shape: "q4_0 / q4_0",
              ctx: "65536",
              batch: "64 / 16",
              logic: "4 / 5",
              prompt: "99.07",
              decode: "31.90",
              verdict: "winner",
              notes: "Best finished short lane so far. TCP smoke landed 97.74 / 32.21."
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "65536",
              batch: "64 / 16",
              logic: "4 / 5",
              prompt: "92.09",
              decode: "30.71",
              verdict: "safe alternative",
              notes: "Still coherent, but slower than the q4_0 / q4_0 winner."
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "65536",
              batch: "64 / 16",
              logic: "4 / 5",
              prompt: "95.71",
              decode: "30.39",
              verdict: "usable mixed lane",
              notes: "Good direct behavior, but not enough better than stock to promote yet."
            },
            {
              shape: "q8_0 / turbo3",
              ctx: "65536",
              batch: "32 / 16",
              logic: "4 / 5",
              prompt: "92.91",
              decode: "30.84",
              verdict: "usable",
              notes: "Direct smokes were clean, but this is not clearly better than simpler lanes."
            },
            {
              shape: "turbo3 / turbo3",
              ctx: "65536",
              batch: "32 / 16",
              logic: "3 / 5",
              prompt: "101.12",
              decode: "27.27",
              verdict: "demote",
              notes: "The first clear short-lane quality drop. TCP output also truncated badly."
            },
            {
              shape: "q8_0 / turbo4",
              ctx: "65536",
              batch: "64 / 16",
              logic: "4 / 5",
              prompt: "95.73",
              decode: "30.74",
              verdict: "usable",
              notes: "Clean direct run, but still not the best finished lane."
            },
            {
              shape: "turbo4 / turbo4",
              ctx: "65536",
              batch: "32 / 16",
              logic: "4 / 5",
              prompt: "99.20",
              decode: "29.69",
              verdict: "strong symmetric option",
              notes: "Finished cleanly, but still behind the q4_0 / q4_0 short winner."
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "262144",
              batch: "32 / 16",
              logic: "4 / 5",
              prompt: "77.54",
              decode: "27.48",
              verdict: "strong native 262k option",
              notes: "Finished direct native-262k pass with better decode than stock q8_0 / q8_0."
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "262144",
              batch: "32 / 16",
              logic: "4 / 5",
              prompt: "69.11",
              decode: "25.19",
              verdict: "safe native 262k fallback",
              notes: "Coherent, but clearly slower than the better mixed and symmetric lanes."
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "262144",
              batch: "32 / 16",
              logic: "4 / 5",
              prompt: "76.01",
              decode: "26.21",
              verdict: "usable native 262k mixed lane",
              notes: "A healthy direct pass, but not the finished winner."
            },
            {
              shape: "q8_0 / turbo3",
              ctx: "262144",
              batch: "32 / 16",
              logic: "4 / 5",
              prompt: "74.96",
              decode: "26.88",
              verdict: "usable",
              notes: "Very close to turbo2, but still behind the best native 262k lane."
            },
            {
              shape: "q8_0 / turbo4",
              ctx: "262144",
              batch: "32 / 16",
              logic: "4 / 5",
              prompt: "72.19",
              decode: "25.50",
              verdict: "usable",
              notes: "Finished, but slower than the better native 262k choices."
            },
            {
              shape: "turbo4 / turbo4",
              ctx: "262144",
              batch: "32 / 16",
              logic: "4 / 5",
              prompt: "82.58",
              decode: "28.31",
              verdict: "best finished native 262k lane",
              notes: "Current direct 262k winner. TCP smoke matched the same 28.31 decode."
            }
          ],
          longContext: [
            {
              shape: "q8_0 / q8_0",
              ctx: "131072",
              batch: "32 / 16",
              fitTarget: "1536",
              prompt: "81.25",
              decode: "18.01",
              result: "retrieval pass at 120179 prompt tokens"
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "131072",
              batch: "32 / 16",
              fitTarget: "1536",
              prompt: "n/a",
              decode: "n/a",
              result: "CUDA OOM near 95 percent prefill at 114208 prompt-side tokens"
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "131072",
              batch: "32 / 16",
              fitTarget: "1536",
              prompt: "n/a",
              decode: "n/a",
              result: "interrupted around 66 percent prompt progress with no answer artifact"
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "262144",
              batch: "32 / 16",
              fitTarget: "2048",
              prompt: "n/a",
              decode: "n/a",
              result: "not run yet"
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "262144",
              batch: "32 / 16",
              fitTarget: "2048",
              prompt: "n/a",
              decode: "n/a",
              result: "not run yet"
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "262144",
              batch: "32 / 16",
              fitTarget: "2048",
              prompt: "n/a",
              decode: "n/a",
              result: "not run yet"
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "393216 linear",
              batch: "16 / 16",
              fitTarget: "3072",
              prompt: "n/a",
              decode: "n/a",
              result: "not run yet"
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "393216 yarn",
              batch: "16 / 16",
              fitTarget: "3072",
              prompt: "n/a",
              decode: "n/a",
              result: "not run yet"
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "393216 yarn",
              batch: "16 / 16",
              fitTarget: "3072",
              prompt: "n/a",
              decode: "n/a",
              result: "not run yet"
            }
          ],
          speculation: [
            {
              profile: "none",
              decode: "28.65",
              acceptance: "n/a",
              verdict: "baseline",
              notes: "q8_0 / q8_0 repeated code-rewrite bench without speculation."
            },
            {
              profile: "code-safe",
              decode: "63.25",
              acceptance: "0.92571",
              verdict: "winner",
              notes: "Clear fast-path winner on the finished q8_0 / q8_0 bench."
            },
            {
              profile: "code-fast",
              decode: "49.30",
              acceptance: "0.84795",
              verdict: "usable",
              notes: "Real gain, but still behind code-safe."
            },
            {
              profile: "repeat",
              decode: "38.38",
              acceptance: "0.53788",
              verdict: "usable",
              notes: "Coherent, but acceptance fell too far to beat code-safe."
            },
            {
              profile: "moe",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with llama_batch size exceeded in the current fusion path."
            }
          ],
          edgeCases: [
            {
              test: "JSON mode",
              result: "fail",
              notes: "Returned fenced JSON instead of raw schema-clean output."
            },
            {
              test: "Tool calling",
              result: "pass",
              notes: "Parsed one tool call cleanly: sum_numbers."
            },
            {
              test: "Assistant prefill",
              result: "fail",
              notes: "Prefill still leaked thought-channel text."
            },
            {
              test: "Reasoning parser",
              result: "risk",
              notes: "Both q8_0 / q8_0 and q8_0 / turbo2 produced reasoning_content but empty final visible content."
            },
            {
              test: "Cache reuse",
              result: "pass",
              notes: "Prompt time dropped from 131555.173 ms to 38.287 ms with 12426 cached tokens on the reuse probe."
            },
            {
              test: "BF16 mmproj fit",
              result: "pass",
              notes: "The first run OOMed on a 1139 MiB projector allocation; the relaunched fit-target reserves fixed it, and only q8_0 / turbo4 still completed at 262k with fit-target 1024."
            },
            {
              test: "Long retrieval ladder",
              result: "risk",
              notes: "The first 131k tranche split three ways: q8_0 / q8_0 passed, q8_0 / turbo2 OOMed, q4_0 / q4_0 was interrupted, and the 262k to 393k extension section still has not been run."
            }
          ]
        }
      ]
    },
    {
      id: "qwen36-claude47-apex-compact",
      name: "Qwen3.6 35B A3B Claude 4.7 Opus Reasoning Distilled APEX Compact",
      shortName: "Qwen3.6 APEX Compact",
      architecture: "Qwen3.6 / A3B MoE / Claude 4.7 distill / APEX Compact",
      status: "Experimental but usable",
      source: "mudler/Qwen3.6-35B-A3B-Claude-4.7-Opus-Reasoning-Distilled-APEX-GGUF",
      summary:
        "This is the newest Qwen 3.6 APEX Compact family added to the fusion dashboard. The direct 262k lane is strong, the 524k YARN extension is real, tool calling and cache reuse work, but the 262k long retrieval ladder still times out on the 3060 and the speculative profiles are broken in the current fusion path.",
      highlights: [
        "The best completed standard 262k lane is q8_0 / turbo3 at 16 / 16, landing about 105.81 prompt tok/s and 39.83 decode tok/s with 4 / 4 logic passes.",
        "The best short lane is q8_0 / turbo2 at 65536 and 64 / 32, landing about 98.82 / 44.87 with 4 / 4 logic passes.",
        "The 524k YARN lane works with q8_0 / turbo2 at 16 / 16, holding about 91.17 / 34.71 with 4 / 4 logic passes.",
        "The 131k retrieval pass succeeded cleanly at 118569 prompt tokens, around 104.84 / 16.35.",
        "The 262k retrieval ladder did not complete inside the 900 second harness budget on this 3060 path.",
        "Tool calling worked, JSON mode fenced its output, and prompt cache reuse was dramatic.",
        "Speculative profiles are not safe here yet: code-safe, code-fast, and repeat failed with Invalid input batch, while moe hit a GGML_ASSERT."
      ],
      recommended: [
        {
          label: "Best standard 262k lane",
          value: "q8_0 / turbo3, ctx 262144, 16 / 16",
          supporting: "4 / 4 logic, about 105.81 / 39.83"
        },
        {
          label: "Best short lane",
          value: "q8_0 / turbo2, ctx 65536, 64 / 32",
          supporting: "4 / 4 logic, about 98.82 / 44.87"
        },
        {
          label: "Best extension lane",
          value: "q8_0 / turbo2, 524k YARN, 16 / 16",
          supporting: "4 / 4 logic, about 91.17 / 34.71"
        },
        {
          label: "Best completed retrieval lane",
          value: "q8_0 / turbo2, 131k long, 32 / 16",
          supporting: "Pass at 118569 prompt tokens, about 104.84 / 16.35"
        },
        {
          label: "Current blocker before promotion",
          value: "262k long retrieval and speculation",
          supporting: "The long ladder timed out on the 3060 and all speculative profiles except baseline are broken"
        }
      ],
      links: [
        { label: "Fusion Live Matrix", href: FUSION_LIVE_MATRIX_URL },
        { label: "Fusion Model Status", href: FUSION_MODEL_STATUS_URL }
      ],
      models: [
        {
          id: "qwen36-claude47-apex-compact-main",
          name: "APEX Compact",
          size: "35B total / 3B active",
          status: "Experimental but usable",
          sourceFile: "Qwen3.6-35B-A3B-Claude-4.7-Opus-Reasoning-Distilled-APEX-Compact.gguf",
          summary:
            "This family is already useful as a normal high-context Qwen lane on the 3060. The main 262k direct path is fast and coherent, YARN is viable, tools and cache reuse are real, but the 262k retrieval ladder still exceeds the current long-test budget and the speculative stack is not ready.",
          recommendedPreset: {
            alias: "qwen36-35b-a3b-claude47-opus-reasoning-distilled-apex-compact-262k",
            cache: "q8_0 / turbo3",
            context: "262144",
            batch: "16 / 16",
            fitTarget: "1024",
            logic: "4 / 4",
            promptTps: "105.81",
            decodeTps: "39.83",
            note: "Best completed standard 262k lane from the full matrix. Use the tools alias in WebUI when the goal is OBS MCP or native tool execution."
          },
          highlightMetrics: [
            {
              label: "Best short direct lane",
              value: "98.82 / 44.87",
              note: "q8_0 / turbo2 at 65536 and 64 / 32"
            },
            {
              label: "Best completed standard 262k lane",
              value: "105.81 / 39.83",
              note: "q8_0 / turbo3 at 262144 and 16 / 16"
            },
            {
              label: "Best completed retrieval pass",
              value: "131k pass",
              note: "118569 prompt tokens at about 104.84 / 16.35"
            },
            {
              label: "Biggest runtime win",
              value: "tool calls and cache reuse",
              note: "Parsed a real tool call and dropped a cache probe from 122163.12 ms to 320.909 ms"
            }
          ],
          kvMatrix: [
            {
              shape: "q8_0 / turbo2",
              ctx: "65536",
              batch: "64 / 32",
              logic: "4 / 4",
              prompt: "98.82",
              decode: "44.87",
              verdict: "best short lane",
              notes: "Fastest clean short-lane balance in the latest matrix."
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "65536",
              batch: "64 / 32",
              logic: "4 / 4",
              prompt: "78.99",
              decode: "44.95",
              verdict: "strong alternative",
              notes: "Decode almost tied the short winner, but prompt speed was much slower."
            },
            {
              shape: "q8_0 / turbo4",
              ctx: "65536",
              batch: "64 / 32",
              logic: "4 / 4",
              prompt: "98.45",
              decode: "43.93",
              verdict: "safe alternative",
              notes: "Very close to turbo2, but not the short-lane winner."
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "262144",
              batch: "16 / 16",
              logic: "4 / 4",
              prompt: "106.39",
              decode: "35.89",
              verdict: "coherent fallback",
              notes: "A fully clean 262k lane, but slower than turbo3."
            },
            {
              shape: "q8_0 / turbo3",
              ctx: "262144",
              batch: "16 / 16",
              logic: "4 / 4",
              prompt: "105.81",
              decode: "39.83",
              verdict: "winner",
              notes: "Best completed standard 262k lane in the full matrix."
            },
            {
              shape: "q8_0 / turbo4",
              ctx: "262144",
              batch: "16 / 16",
              logic: "3 / 4",
              prompt: "104.89",
              decode: "39.97",
              verdict: "regressed",
              notes: "Slightly faster decode than turbo3, but it dropped a logic point."
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "524288 yarn",
              batch: "16 / 16",
              logic: "4 / 4",
              prompt: "91.17",
              decode: "34.71",
              verdict: "best extension lane",
              notes: "The finished YARN extension lane was coherent and strong enough to keep."
            }
          ],
          longContext: [
            {
              shape: "q8_0 / turbo2",
              ctx: "131072",
              batch: "32 / 16",
              fitTarget: "1024",
              prompt: "104.84",
              decode: "16.35",
              result: "retrieval pass at 118569 prompt tokens"
            },
            {
              shape: "q8_0 / turbo2",
              ctx: "262144",
              batch: "16 / 16",
              fitTarget: "1024",
              prompt: "n/a",
              decode: "n/a",
              result: "did not finish inside the 900 second bench window; about 27.9 percent prompt progress and roughly 67k prompt-side tokens ingested"
            }
          ],
          speculation: [
            {
              profile: "none",
              decode: "42.54",
              acceptance: "n/a",
              verdict: "baseline",
              notes: "q4_0 / q4_0 repeated code-rewrite bench without speculation."
            },
            {
              profile: "code-safe",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            },
            {
              profile: "code-fast",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            },
            {
              profile: "repeat",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            },
            {
              profile: "moe",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with GGML_ASSERT after llama_batch size exceeded."
            }
          ],
          edgeCases: [
            {
              test: "JSON mode",
              result: "fail",
              notes: "Returned fenced JSON instead of raw schema-clean output."
            },
            {
              test: "Tool calling",
              result: "pass",
              notes: "Parsed one tool call cleanly: sum_numbers."
            },
            {
              test: "Assistant prefill",
              result: "risk",
              notes: "Prefill leaked think tags into visible content before the final answer."
            },
            {
              test: "Reasoning path",
              result: "risk",
              notes: "The dedicated reasoning matrix was stable, but the clean router smoke still showed one tiny alias case with reasoning content and empty final visible content."
            },
            {
              test: "Cache reuse",
              result: "pass",
              notes: "Prompt time dropped from 122163.12 ms to 320.909 ms with 12788 cached tokens on the reuse probe."
            },
            {
              test: "Long retrieval ladder",
              result: "risk",
              notes: "131k passed, but the 262k retrieval pass did not finish inside the current 900 second harness budget on the RTX 3060 path."
            }
          ]
        }
      ]
    },
    {
      id: "nemotron-3-nano-30b-a3b-mxfp4-moe",
      name: "NVIDIA-Nemotron-3-Nano-30B-A3B-MXFP4_MOE.gguf",
      shortName: "NVIDIA Nemotron 30B",
      architecture: "Nemotron / MXFP4 MoE",
      status: "Experimental but usable",
      source: "noctrex/Nemotron-3-Nano-30B-A3B-MXFP4_MOE-GGUF",
      summary:
        "This family entry is for the exact tested GGUF file NVIDIA-Nemotron-3-Nano-30B-A3B-MXFP4_MOE.gguf, not the separate Omni/Reasoning GGUF line. The main matrix was run with thinking off, and a separate reasoning-on pass was run afterward. Decode stayed in the 26 tok/s band from 32k through native 262k and remained there through 393k and 524k YaRN, but the logic suite stayed uneven and speculative profiles are still broken.",
      highlights: [
        "The best native keep is turbo3 / q8_0 at 262144 with about 47.77 / 26.15 and 3 / 5 logic.",
        "YaRN extension held up unusually well here, with a usable 524288 q8_0 / q8_0 lane at about 45.06 / 26.26.",
        "JSON mode, tool calls, and prompt-cache reuse all worked on the edge checks.",
        "All draftless speculative profiles failed with Invalid input batch, so this family is not ready for speculative promotion."
      ],
      recommended: [
        {
          label: "Best native keep",
          value: "turbo3 / q8_0, ctx 262144, 16 / 16",
          supporting: "3 / 5 logic, about 47.77 / 26.15"
        },
        {
          label: "Best long-context keep",
          value: "q8_0 / q8_0, ctx 524288 yarn, 8 / 8",
          supporting: "2 / 5 logic, about 45.06 / 26.26"
        },
        {
          label: "Best completed retrieval pass",
          value: "q4_0 / q4_0, ctx 131072, 32 / 16",
          supporting: "Pass at 115395 prompt tokens, about 49.69 / 15.16"
        },
        {
          label: "Current blocker before wider promotion",
          value: "logic misses and broken speculation",
          supporting: "semantic_interference and vowels_i_count keep failing, and all speculative profiles error out"
        }
      ],
      links: [
        { label: "Dedicated Page", href: "./nemotron-3-nano-30b-a3b-mxfp4-moe.html" },
        { label: "Fusion Live Matrix", href: FUSION_LIVE_MATRIX_URL },
        { label: "Fusion Model Status", href: FUSION_MODEL_STATUS_URL }
      ],
      models: [
        {
          id: "nemotron-3-nano-30b-a3b-mxfp4-moe-main",
          name: "NVIDIA-Nemotron-3-Nano-30B-A3B-MXFP4_MOE.gguf",
          size: "30B total / 3B active",
          status: "Experimental but usable",
          sourceFile: "NVIDIA-Nemotron-3-Nano-30B-A3B-MXFP4_MOE.gguf",
          summary:
            "The main surprise here is consistency. Once cpu-moe is enabled, this exact GGUF holds decode in the mid-26 tok/s range almost regardless of context size, including the 524k YaRN extension, while keeping native JSON and tool calls alive. The base matrix used thinking off, then a separate reasoning-on check validated visible final content at multiple budgets.",
          recommendedPreset: {
            alias: "nemotron-3-nano-30b-a3b-mxfp4-moe-262k",
            cache: "turbo3 / q8_0",
            context: "262144",
            batch: "16 / 16",
            fitTarget: "1024",
            logic: "3 / 5",
            promptTps: "47.77",
            decodeTps: "26.15",
            note: "Best promoted native preset. Use the -tools alias in WebUI when the goal is MCP or native tool execution."
          },
          highlightMetrics: [
            {
              label: "Best short direct lane",
              value: "29.91 / 26.38",
              note: "q4_0 / q4_0 at 32768 with n-cpu-moe = 8"
            },
            {
              label: "Best native 262k keep",
              value: "47.77 / 26.15",
              note: "turbo3 / q8_0 at 262144 and 16 / 16"
            },
            {
              label: "Best 524k keep",
              value: "45.06 / 26.26",
              note: "q8_0 / q8_0 at 524288 yarn and 8 / 8"
            },
            {
              label: "Biggest runtime win",
              value: "tool calls and cache reuse",
              note: "Parsed one clean tool call and dropped the second cache prompt to about 1104 ms"
            }
          ],
          kvMatrix: [
            {
              shape: "q4_0 / q4_0",
              ctx: "32768",
              batch: "64 / 32",
              logic: "2 / 5",
              prompt: "29.91",
              decode: "26.38",
              verdict: "best short lane",
              notes: "Needed cpu-moe with n-cpu-moe = 8."
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "65536",
              batch: "64 / 32",
              logic: "2 / 5",
              prompt: "29.38",
              decode: "26.38",
              verdict: "safe alternative",
              notes: "Clean simple 65k stock keep."
            },
            {
              shape: "q4_0 / q4_0",
              ctx: "131072",
              batch: "32 / 16",
              logic: "2 / 5",
              prompt: "48.67",
              decode: "26.21",
              verdict: "strong alternative",
              notes: "Best 131k code-path decode, again with n-cpu-moe = 8."
            },
            {
              shape: "turbo3 / q8_0",
              ctx: "262144",
              batch: "16 / 16",
              logic: "3 / 5",
              prompt: "47.77",
              decode: "26.15",
              verdict: "winner",
              notes: "Best promoted native preset."
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "524288 yarn",
              batch: "8 / 8",
              logic: "2 / 5",
              prompt: "45.06",
              decode: "26.26",
              verdict: "best extension lane",
              notes: "Chosen public long-context keep."
            }
          ],
          longContext: [
            {
              shape: "q4_0 / q4_0",
              ctx: "131072",
              batch: "32 / 16",
              fitTarget: "1024",
              prompt: "49.69",
              decode: "15.16",
              result: "retrieval pass at 115395 prompt tokens"
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "393216 yarn",
              batch: "16 / 8",
              fitTarget: "2048",
              prompt: "45.33",
              decode: "26.30",
              result: "best 393k extension keep"
            },
            {
              shape: "q8_0 / q8_0",
              ctx: "524288 yarn",
              batch: "8 / 8",
              fitTarget: "2048",
              prompt: "45.06",
              decode: "26.26",
              result: "best 524k extension keep"
            }
          ],
          speculation: [
            {
              profile: "none",
              decode: "23.61",
              acceptance: "n/a",
              verdict: "baseline",
              notes: "q4_0 / q4_0 repeated code-rewrite bench without speculation."
            },
            {
              profile: "code-safe",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            },
            {
              profile: "code-fast",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            },
            {
              profile: "repeat",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            },
            {
              profile: "moe",
              decode: "n/a",
              acceptance: "n/a",
              verdict: "broken",
              notes: "Failed with Invalid input batch."
            }
          ],
          edgeCases: [
            {
              test: "JSON mode",
              result: "pass",
              notes: "Returned clean JSON in the edge lane."
            },
            {
              test: "Tool calling",
              result: "pass",
              notes: "Parsed one tool call cleanly: sum_numbers."
            },
            {
              test: "Reasoning path",
              result: "pass",
              notes: "The main matrix used thinking off. A separate reasoning-on pass stayed stable at budgets 64, 256, and 512 with visible final content present."
            },
            {
              test: "Cache reuse",
              result: "pass",
              notes: "Prompt time dropped from 369287.947 ms to 1104.337 ms with 12394 cached tokens."
            },
            {
              test: "Speculative profiles",
              result: "fail",
              notes: "code-safe, code-fast, repeat, and moe all failed with Invalid input batch."
            },
            {
              test: "Long retrieval ladder",
              result: "pass",
              notes: "131k retrieval passed cleanly on q4_0 / q4_0."
            }
          ]
        }
      ]
    }
  ]
};
