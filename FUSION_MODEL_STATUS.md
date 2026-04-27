# Fusion Model Status

For a browsable, family-oriented companion view, open the
[Fusion Results Site](./fusion-results-site/index.html).

This file tracks what the live local router is doing now that `fusion-lab` is
the primary runtime for VS Code, Continue, and Open WebUI.

Important runtime note: the shared router currently injects its global
`--threads 8` setting in router mode. Per-model cache, fit, batching, and
`spec-profile` settings are taking effect, but exact sidecar benchmark thread
counts are not always reproduced 1:1 in the live multi-model service.

Status labels:

- `fusion-verified`: benchmarked directly on `build-fusion`
- `fusion-family-carryover`: moved to a fusion-style preset because a close
  family member was benchmarked directly, but explicit per-model validation is
  still pending
- `edgelab-carryover`: still using the prior stable preset while served by the
  fusion binary
- `blocked`: benchmarked on `build-fusion`, but no usable live preset was found
- `needs-check`: explicit fusion benchmark still required

## Promoted Fusion Presets

| Model preset | Status | Live preset source | Notes |
|---|---|---|---|
| `qwen3-coder-30b-a3b-instruct-1m-ud-tq1_0` | `fusion-verified` | direct `fusion-lab` benchmark | direct speed winner was `q4_0/q4_0`, `131072`, `128/64`, `spec-profile = code-safe`, but the live router now uses the conservative WebUI-safe shape: `q4_0/q4_0`, `131072`, `fit-target = 0`, `64/32`, no `spec-profile`, `threads = 8`, `threads-batch = 8` |
| `qwen3-coder-30b-a3b-instruct-heretic-i1-q4km` | `fusion-verified` | direct `fusion-lab` benchmark | best balanced direct result is `q4_0/q4_0`, `131072`, `fit-target = 4096`, `64/32`, `spec-profile = code-safe`; the speed-biased `128/64` non-spec shape raised prompt ingest to about `64.82 tok/s` but lost decode speed, while `fit-target = 0` aborted |
| `qwen25-coder-14b-instruct-abliterated-q4km` | `fusion-verified` | direct `fusion-lab` benchmark | best practical live shape is `q8_0/q8_0`, `32768`, `fit-target = 128`, `256/128`, `spec-profile = code-safe`; `q4_0/q4_0` and `q8_0/turbo2` stayed coherent but slower, and the `65536` follow-up remained coherent but far too slow to promote |
| `qwen35-9b-claude46-opus-reasoning-distilled-q6k` | `fusion-verified` | direct `fusion-lab` benchmark | best practical live shape is `q8_0/turbo2`, `32768`, `fit-target = 0`, `256/128`, `reasoning-budget = 0`, `reasoning-format = deepseek`; speculative profiles did not add useful speedup on the TCP smoke |
| `deepseek-r1-distill-qwen-7b-q6k-reasoning` | `fusion-verified` | direct `fusion-lab` benchmark | only honest DeepSeek live lane is `q8_0/q8_0`, `32768`, `fit-target = 0`, `256/128`, `reasoning-budget = 512`, `reasoning-format = deepseek`; `q8_0/turbo2`, `q8_0/turbo3`, `q8_0/turbo4`, and the asymmetric or `q4_0/*` variants all regressed to `2/5` or worse on the hidden-answer suite, draftless speculation was effectively neutral, `65536+` long-context probes were not promotable on this 3060, and edge-case support stayed weak outside reasoning parsing and cache reuse |
| `qwen3-30b-a3b-abliterated-iq4xs` | `fusion-verified` | direct `fusion-lab` benchmark | medium-context screen (`~7.2k` prompt tokens) stayed coherent on `turbo3/turbo3`, `q4_0/q4_0`, and `q8_0/q8_0`; `turbo3/turbo3` won prompt speed, but the heavier long-context probe OOMed on the 3060, so the live preset now uses `q4_0/q4_0`, `131072`, `fit-target = 128`, `64/32` |
| `qwen3-30b-a3b-abliterated-iq4xs-maxctx` | `fusion-verified` | direct `fusion-lab` benchmark | salvaged on the 3060 with `q4_0/q4_0`, `262144`, `fit-target = 0`, `32/16`, `spec-profile = code-safe`; medium `~8.8k` prompt screen landed about `53.59 tok/s` prompt and `18.51 tok/s` decode with `code-safe`, the non-spec base held a heavier `~28.3k` prompt at about `52.47 / 9.32`, `q4_0/q4_0` and `q8_0/turbo2` `64/32` both OOMed, `q8_0/turbo2` and `q8_0/turbo3` `32/16` survived but were slower, and explicit YaRN was much slower on the same medium probe so it was not promoted |
| `qwen3-8b-unsloth-q4km` | `fusion-verified` | direct `fusion-lab` benchmark | promoted live winner is `q4_0/q4_0`, `131072`, `fit-target = 0`, `1024/512`, `spec-profile = code-safe`, `mmap = 0`; the non-spec base landed about `1726.45 tok/s` prompt and `35.02 tok/s` decode on a medium `~8.8k` prompt screen, `code-safe` kept prompt speed about flat and raised medium decode to `53.43 tok/s`, then held a heavier `~16.6k` prompt at about `1495.08 / 38.13`; `q8_0/turbo2` was the only close alternative, but still slower at about `1661.45 / 34.66`, and explicit YaRN hurt throughput without improving stability |
| `GLM-4.7-Flash-MXFP4` | `fusion-verified` | direct `fusion-lab` benchmark | the initial fusion-style `flash-attn = on` matrix crashed across `q8_0/q8_0`, `q8_0/turbo2`, `q8_0/turbo3`, `q8_0/turbo4`, and symmetric TurboQuant cases; the only surviving safe direct shape on this 3060 was `q8_0/turbo3`, `65536`, `64/32`, `flash-attn = off`, no fit, at about `46.93 tok/s` prompt and `20.42 tok/s` decode on the long probe |
| `gemma-4-26B-A4B-it-Q4_K_M` | `fusion-verified` | direct `fusion-lab` multimodal benchmark | safe winner stays `q8_0/turbo2`, `65536`, `fit-target = 1536`, `512/512`, `mmap = 0`; `131072` also works but is slower, while `turbo4/*` image requests aborted and `q4_0/q4_0` did not survive first-response load with `mmproj` |
| `gemma-4-26B-A4B-it-Q4_K_M-fasttext` | `fusion-verified` | direct `fusion-lab` benchmark | promoted live winner is text-only dense `q4_0/q4_0`, `131072`, `fit-target = 0`, `1024/512`, `spec-profile = code-safe`; medium `~8.8k` probe landed about `811.50 tok/s` prompt and `34.66 tok/s` decode, the non-spec heavy `~16.6k` probe held about `810.03 / 28.25`, `q8_0/turbo2` and `q8_0/turbo3` were coherent but slower, and `mmproj` only stayed practical on the smaller stock multimodal shape `q8_0/turbo2`, `65536`, `512/512`, `fit-target = 1536` at about `734.95 / 26.06` text plus `160.38 / 20.45` image; `131072` multimodal attempts OOMed on this 3060, so the fast alias stays text-only |
| `gemma-4-26b-a4b-it-heretic-q4km` | `fusion-verified` | direct `fusion-lab` benchmark | `q4_0/q4_0`, `262144`, `fit-target = 512`, `512/256`, `mmap = 0` |
| `gemma-4-26b-a4b-it-heretic-q4km-fast` | `fusion-verified` | direct `fusion-lab` benchmark | promoted live winner is text-only dense `q4_0/q4_0`, `131072`, `fit-target = 0`, `1024/512`, `spec-profile = code-safe`; medium `~8.8k` probe landed about `820.83 tok/s` prompt and `34.93 tok/s` decode, the non-spec heavy `~16.6k` probe held about `815.60 / 28.20`, `q8_0/turbo2` and `q8_0/turbo3` were coherent but slower, and the stock Gemma projector only stayed practical on the smaller `q8_0/turbo2`, `65536`, `512/512`, `fit-target = 1536` multimodal shape at about `733.60 / 25.71` text plus `171.81 / 28.07` image; all tested `131072` multimodal Heretic attempts OOMed, so the fast alias stays text-only |
| `gemma-4-e4b-hauhau-aggressive-q4km` | `fusion-verified` | direct `fusion-lab` benchmark | promoted live winner is dense `q4_0/q4_0`, `131072`, `fit-target = 0`, `1024/512`, `spec-profile = code-safe`; medium `~8.8k` probe landed about `2618.81 tok/s` prompt and `86.36 tok/s` decode, the non-spec heavy `~16.6k` probe held about `2421.32 / 57.04`, `q8_0/q8_0` was close but slightly slower, and the old `q8_0/turbo2` carryover shape lost clearly on both prompt speed and decode |
| `gemma-4-e4b-it-unsloth-ud-q8kxl` | `fusion-verified` | direct `fusion-lab` benchmark | promoted live winner is dense `q4_0/q4_0`, `131072`, `fit-target = 0`, `1024/512`, `mmproj`; medium `~8.8k` probe landed about `2724.91 tok/s` prompt and `44.55 tok/s` decode, the heavier `~16.6k` probe held about `2528.75 / 41.65`, `q8_0/q8_0` stayed extremely close but slightly slower overall, and `spec-profile = code-safe` repeatedly aborted on the dense and stock-KV family branches so it was not promoted |
| `gemma-4-e4b-it-unsloth-ud-q8kxl-q8t2` | `fusion-verified` | direct `fusion-lab` benchmark | promoted live winner is `q8_0/turbo2`, `131072`, `fit-target = 0`, `1024/512`, `mmproj`; medium `~8.8k` probe landed about `2653.63 tok/s` prompt and `43.81 tok/s` decode, the heavier `~16.6k` probe held about `2468.05 / 40.63`, and the older `32768` branches were essentially tied but not better enough to justify keeping the smaller context window |
| `gemma-4-e4b-it-unsloth-ud-q8kxl-q8t3` | `fusion-verified` | direct `fusion-lab` benchmark | promoted live winner is `q8_0/turbo3`, `131072`, `fit-target = 0`, `1024/512`, `mmproj`; medium `~8.8k` probe landed about `2640.28 tok/s` prompt and `42.82 tok/s` decode, the heavier `~16.6k` probe held about `2453.99 / 39.50`, and the older `32768` branches were only tie-close, not faster enough to justify keeping the smaller context window |
| `gemma-4-e4b-it-unsloth-ud-q8kxl-q8t4` | `fusion-verified` | direct `fusion-lab` benchmark | promoted live winner is `q8_0/turbo4`, `131072`, `fit-target = 0`, `1024/512`, `mmproj`; medium `~8.8k` probe landed about `2635.96 tok/s` prompt and `41.28 tok/s` decode, the heavier `~16.8k` probe held about `2441.77 / 37.56`, the smaller `512/512` variant was effectively tied but slightly slower on prompt ingest, and `spec-profile = code-safe` aborted the server so it was not promoted |
| `google-gemma-4-26b-a4b-it-iq3xxs` | `fusion-verified` | direct `fusion-lab` benchmark | `turbo2/turbo2`, `131072`, `fit-target = 128`, `512/512`, `mmap = 0`; `q4_0/q4_0` also works and is close on prompt speed, but `turbo2/turbo2` stayed slightly faster overall and kept the best decode speed |
| `google-gemma-4-26b-a4b-it-iq3xxs-maxctx` | `fusion-verified` | direct `fusion-lab` benchmark | `turbo2/turbo2`, `262144`, `fit-target = 512`, `512/512`, `mmap = 0`; `q4_0/q4_0` and `q8_0/turbo2` both stayed coherent but were slower on the medium long-context screen |
| `huihui-gpt-oss-20b-abliterated-v2-mxfp4_moe` | `fusion-verified` | direct `fusion-lab` benchmark | current live stock winner remains `q8_0/q8_0`, `65536`, `64/16`; `131072` stock aborted in CUDA graph capture and the compressed-KV candidates either OOMed, crashed, or lost visible content on longer prompts |
| `NVIDIA-Nemotron-3-Nano-4B-Q4_K_M` | `fusion-verified` | direct `fusion-lab` benchmark | promoted live winner is dense `q4_0/q4_0`, `32768`, `2048/1024`, `parallel = 1`, `mmap = 0`, `n-gpu-layers = 99`, no `fit`; medium `~8.8k` probe landed about `2377.42 tok/s` prompt and `78.98 tok/s` decode, the heavier `~16.6k` probe held about `2295.97 / 69.92`, `q8_0/q8_0` was essentially tied but not meaningfully better, `q8_0/turbo2` and `q8_0/turbo3` were close but slightly slower, and `code-safe` hit a reproducible `Invalid input batch` server bug on both dense and mixed-KV branches so it was not promoted |
| `Nemotron-Cascade-2-30B-A3B-MXFP4_MOE` | `fusion-verified` | direct `fusion-lab` benchmark | best practical live shape is `q4_0/q4_0`, `131072`, `fit-target = 0`, `32/16`; `q8_0/turbo3` was the strongest compressed-KV alternative, but slightly slower on the long rewrite probe |
| `nemotron-3-nano-30b-a3b-unsloth-iq4nl` | `fusion-verified` | direct `fusion-lab` benchmark | best practical live shape is `turbo3/q8_0`, `131072`, `cpu-moe`, `n-cpu-moe = 4`, `n-gpu-layers = 99`, `reasoning = off`; the older reasoning-on shapes added fenced/special-token junk and were slightly slower |
| `nemotron-3-nano-30b-a3b-unsloth-q4km` | `fusion-verified` | direct `fusion-lab` benchmark | promoted live winner is dense `q4_0/q4_0`, `131072`, `32/16`, `cpu-moe`, `n-gpu-layers = 99`, `n-cpu-moe = 4`; baseline medium `~8.8k` probe landed about `41.48 tok/s` prompt and `16.19 tok/s` decode, the `fit-target = 0` and `moe` variants did not improve the long decode winner, the heavier `~16.8k` probe held about `41.15 / 15.67`, and the prior `q8_0/turbo4` carryover plus the other mixed-KV branches all stayed slightly slower |
| `nemotron-3-nano-30b-a3b-unsloth-q5km` | `fusion-verified` | direct `fusion-lab` benchmark | promoted live winner is `q8_0/q8_0`, `65536`, `32/16`, with the original `gpu-layers = 55`, `n-cpu-moe = 99`, and `cont-batching = 1`; baseline medium `~8.8k` probe landed about `39.63 tok/s` prompt and `15.37 tok/s` decode, the heavier `~16.8k` probe held about `38.20 / 14.90`, `fit-target = 0`, the denser GPU split, and `spec-profile = moe` all regressed, and dense `q4_0/q4_0` was far worse on the long probe |
| `qwopus35-9b-v3` | `fusion-verified` | direct `fusion-lab` benchmark | promoted live winner is `q8_0/q8_0`, `262144`, `fit-target = 128`, `128/64`, `mmproj`, `reasoning = off`; it beat the old `q8_0/turbo2`, `64/32` carryover by keeping the full `262K` context while raising long prompt speed to about `984.30 tok/s` and slightly improving long decode to about `29.59 tok/s` |

## Benchmarked But Not Promoted

| Model preset | Status | Why it was not promoted |
|---|---|---|
| `Nemotron-Cascade-2-30B-A3B-TQ1_0` | `blocked` | every tested cache mode at `65536` failed even a trivial one-word chat obedience check, and `q8_0/turbo2` still failed at `8192`; no usable fusion chat preset was found on this 3060 |

## Still Needs Fusion Check

No explicit model presets are still pending direct `build-fusion` validation.
The only remaining non-promoted item in the live catalog is the blocked
`Nemotron-Cascade-2-30B-A3B-TQ1_0`.
