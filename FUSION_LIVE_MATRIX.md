# Fusion Live Matrix

For a browsable, family-oriented view of these results, open the
[Fusion Results Site](./fusion-results-site/index.html).

Current optimized `build-fusion` presets and their best noted direct benchmark
shapes on this RTX 3060. This is a compact companion to
[`FUSION_MODEL_STATUS.md`](./FUSION_MODEL_STATUS.md), not a replacement.

`prompt / decode tok/s` values are the best noted direct sidecar numbers for the
named winning shape or the closest recorded long probe. Logic scores only
appear where the hidden-answer suite has actually been run.

| Model | Current live / promoted shape | Best noted tok/s | Logic |
|---|---|---:|---:|
| `qwen3-coder-30b-a3b-instruct-1m-ud-tq1_0` | `q4_0/q4_0`, `131072`, conservative live `64/32`; direct speed winner was `128/64 + code-safe` | about `495.37 / 137.93` | not run |
| `qwen3-coder-30b-a3b-instruct-heretic-i1-q4km` | `q4_0/q4_0`, `131072`, `fit-target = 4096`, `64/32`, `code-safe` | about `37.41 / 16.90` | `3/5` |
| `qwen25-coder-14b-instruct-abliterated-q4km` | `q8_0/q8_0`, `32768`, `fit-target = 128`, `256/128`, `code-safe` | about `729.37 / 25.36` | not run |
| `qwen35-9b-claude46-opus-reasoning-distilled-q6k` | `q8_0/turbo2`, `32768`, `fit-target = 0`, `256/128` | about `373.84 / 40.66` | not run |
| `deepseek-r1-distill-qwen-7b-q6k-reasoning` | `q8_0/q8_0`, `32768`, `fit-target = 0`, `256/128`, `reasoning-budget = 512`, `reasoning-format = deepseek` | about `469.77 / 17.76` | `3/5` |
| `qwen3-30b-a3b-abliterated-iq4xs` | `q4_0/q4_0`, `131072`, `fit-target = 128`, `64/32` | about `73.50 / 19.09` | not run |
| `qwen3-30b-a3b-abliterated-iq4xs-maxctx` | `q4_0/q4_0`, `262144`, `fit-target = 0`, `32/16`, `code-safe` | about `53.59 / 18.51`; heavy `52.47 / 9.32` | `4/5` |
| `qwen3-8b-unsloth-q4km` | `q4_0/q4_0`, `131072`, `fit-target = 0`, `1024/512`, `code-safe` | about `1721.14 / 53.43`; heavy `1495.08 / 38.13` | `4/5` |
| `GLM-4.7-Flash-MXFP4` | `q8_0/turbo3`, `65536`, `64/32`, `flash-attn = off` | about `46.93 / 20.42` | not run |
| `gemma-4-26B-A4B-it-Q4_K_M` | `q8_0/turbo2`, `65536`, `fit-target = 1536`, `512/512`, `mmap = 0` | about `130.22 / 27.68` text; `172.74 / 27.74` image | not run |
| `gemma-4-26B-A4B-it-Q4_K_M-fasttext` | `q4_0/q4_0`, `131072`, `fit-target = 0`, `1024/512`, `code-safe`, text-only | about `811.50 / 34.66`; heavy non-spec `810.03 / 28.25` | `4/5` |
| `gemma-4-26b-a4b-it-heretic-q4km` | `q4_0/q4_0`, `262144`, `fit-target = 512`, `512/256`, `mmap = 0` | about `130.74 / 26.70` | not run |
| `gemma-4-26b-a4b-it-heretic-q4km-fast` | `q4_0/q4_0`, `131072`, `fit-target = 0`, `1024/512`, `code-safe`, text-only | about `820.83 / 34.93`; heavy non-spec `815.60 / 28.20` | `4/5` |
| `gemma-4-e4b-hauhau-aggressive-q4km` | `q4_0/q4_0`, `131072`, `fit-target = 0`, `1024/512`, `code-safe` | about `2618.81 / 86.36`; heavy non-spec `2421.32 / 57.04` | `3/5` |
| `gemma-4-e4b-it-unsloth-ud-q8kxl` | `q4_0/q4_0`, `131072`, `fit-target = 0`, `1024/512`, `mmproj` | about `2724.91 / 44.55`; heavy `2528.75 / 41.65` | `3/5` |
| `gemma-4-e4b-it-unsloth-ud-q8kxl-q8t2` | `q8_0/turbo2`, `131072`, `fit-target = 0`, `1024/512`, `mmproj` | about `2653.63 / 43.81`; heavy `2468.05 / 40.63` | `3/5` |
| `gemma-4-e4b-it-unsloth-ud-q8kxl-q8t3` | `q8_0/turbo3`, `131072`, `fit-target = 0`, `1024/512`, `mmproj` | about `2640.28 / 42.82`; heavy `2453.99 / 39.50` | `3/5` |
| `gemma-4-e4b-it-unsloth-ud-q8kxl-q8t4` | `q8_0/turbo4`, `131072`, `fit-target = 0`, `1024/512`, `mmproj` | about `2635.96 / 41.28`; heavy `2441.77 / 37.56` | `3/5` |
| `google-gemma-4-26b-a4b-it-iq3xxs` | `turbo2/turbo2`, `131072`, `fit-target = 128`, `512/512`, `mmap = 0` | about `1383.00 / 44.80` | not run |
| `google-gemma-4-26b-a4b-it-iq3xxs-maxctx` | `turbo2/turbo2`, `262144`, `fit-target = 512`, `512/512`, `mmap = 0` | about `1150.41 / 33.50` | not run |
| `huihui-gpt-oss-20b-abliterated-v2-mxfp4_moe` | `q8_0/q8_0`, `65536`, `fit-target = 0`, `64/16` | about `219.60 / 62.19` | not run |
| `NVIDIA-Nemotron-3-Nano-4B-Q4_K_M` | `q4_0/q4_0`, `32768`, `2048/1024`, no `fit`, `mmap = 0` | about `2377.42 / 78.98`; heavy `2295.97 / 69.92` | `4/5` |
| `Nemotron-Cascade-2-30B-A3B-MXFP4_MOE` | `q4_0/q4_0`, `131072`, `fit-target = 0`, `32/16` | about `100.37 / 37.53` | `2/5` |
| `nemotron-3-nano-30b-a3b-unsloth-iq4nl` | `turbo3/q8_0`, `131072`, `cpu-moe`, `n-cpu-moe = 4` | about `29.61 / 21.10` | not run |
| `nemotron-3-nano-30b-a3b-unsloth-q4km` | `q4_0/q4_0`, `131072`, `32/16`, `cpu-moe`, `n-cpu-moe = 4` | about `41.48 / 16.19`; heavy `41.15 / 15.67` | `2/5` |
| `nemotron-3-nano-30b-a3b-unsloth-q5km` | `q8_0/q8_0`, `65536`, `32/16`, `gpu-layers = 55`, `n-cpu-moe = 99` | about `39.63 / 15.37`; heavy `38.20 / 14.90` | `2/5` |
| `qwopus35-9b-v3` | `q8_0/q8_0`, `262144`, `fit-target = 128`, `128/64` | about `984.30 / 29.59` | `4/5` |

## Still Pending

No promoted live aliases are still pending explicit `build-fusion` validation.

Blocked / not promotable:

- `Nemotron-Cascade-2-30B-A3B-TQ1_0`
