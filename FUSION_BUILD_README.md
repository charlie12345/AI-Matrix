# Fusion Build

`Fusion Build` is a portable downstream `llama.cpp` integration repo that keeps
the CUDA/runtime work needed for this local stack in one place:

- TurboQuant KV cache support and mixed/asymmetric KV presets
- TriAttention-related integration work
- draftless speculative profile plumbing
- fusion-specific CMake presets for Linux and Windows

This repo is meant to be easy to clone and build on another machine. It is not
a clean-room rewrite. It is an integration fork built on top of upstream
[`ggml-org/llama.cpp`](https://github.com/ggml-org/llama.cpp) plus targeted
imports and downstream runtime changes tracked in this repo’s provenance docs.
It is published as a standalone repository, not as a GitHub fork.

Start here for provenance and licensing:

- [LICENSES_AND_ATTRIBUTION.md](LICENSES_AND_ATTRIBUTION.md)
- [NOTICE.md](NOTICE.md)
- [docs/FUSION_GITHUB_SOURCES_AND_LICENSES.md](docs/FUSION_GITHUB_SOURCES_AND_LICENSES.md)
- [docs/FUSION_UPSTREAMS.json](docs/FUSION_UPSTREAMS.json)
- [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)

## What This Repo Is For

Use this repo if you want:

- a reproducible fusion runtime snapshot
- a single repo with the relevant build files for Linux and Windows
- explicit attribution for the upstream code sources that fed the build
- a starting point for local `llama-server` based inference on NVIDIA hardware

Use upstream `llama.cpp` directly if you do not need the fusion-specific
runtime work.

## Clone

```bash
git clone https://github.com/charlie12345/fusion-build.git
cd fusion-build
```

## Quick Start

### Windows

Open an `x64 Native Tools Command Prompt for VS 2022` or `Developer PowerShell
for VS 2022`.

CUDA build:

```powershell
cmake --fresh --preset fusion-windows-vs2022-cuda-release
cmake --build --preset build-fusion-windows-vs2022-cuda-release --target llama-server
```

Helper script:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build-fusion-windows.ps1 -Backend cuda -Generator vs2022 -Fresh
```

CPU-only build:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build-fusion-windows.ps1 -Backend cpu -Generator vs2022 -Fresh
```

### Linux

CUDA build:

```bash
cmake --preset fusion-linux-cuda-release
cmake --build --preset build-fusion-linux-cuda-release --target llama-server
```

Helper script:

```bash
./scripts/build-fusion-linux.sh cuda
```

CPU-only build:

```bash
./scripts/build-fusion-linux.sh cpu
```

More build detail is in [BUILD_FUSION.md](BUILD_FUSION.md).
System requirements are listed in [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md).

## Recommended First Build Target

Build `llama-server` first.

That is the cleanest smoke target before trying broader tool builds.

## Repo Layout

- [BUILD_FUSION.md](BUILD_FUSION.md)
  Quick Linux and Windows build guide.
- [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)
  Toolchain and platform requirements.
- [docs/FUSION_GITHUB_SOURCES_AND_LICENSES.md](docs/FUSION_GITHUB_SOURCES_AND_LICENSES.md)
  Public source repos, branches, and attribution notes.
- [docs/FUSION_UPSTREAMS.json](docs/FUSION_UPSTREAMS.json)
  Machine-readable upstream tracking manifest.
- [docs/UPSTREAM_AUTOMATION.md](docs/UPSTREAM_AUTOMATION.md)
  How upstream status refresh works in this repo.
- [docs/UPSTREAM_STATUS.md](docs/UPSTREAM_STATUS.md)
  Latest generated upstream watch report.
- [docs/FUSION_MODEL_STATUS.md](docs/FUSION_MODEL_STATUS.md)
  Model-level fusion notes and benchmark-backed status.
- [docs/FUSION_LIVE_MATRIX.md](docs/FUSION_LIVE_MATRIX.md)
  Benchmark notes for the local fusion runtime.
- [scripts/build-fusion-windows.ps1](scripts/build-fusion-windows.ps1)
  Windows helper wrapper.
- [scripts/build-fusion-linux.sh](scripts/build-fusion-linux.sh)
  Linux helper wrapper.

Core code remains in the standard upstream-style layout:

- [src/](src)
- [common/](common)
- [ggml/](ggml)
- [include/](include)
- [tools/](tools)

## Public Source Basis

The main public GitHub sources that fed this integration repo are:

- [`ggml-org/llama.cpp`](https://github.com/ggml-org/llama.cpp)
- [`TheTom/llama-cpp-turboquant`](https://github.com/TheTom/llama-cpp-turboquant)
- [`TheTom/turboquant_plus`](https://github.com/TheTom/turboquant_plus)
- [`domvox/llama.cpp-turboquant-hip`](https://github.com/domvox/llama.cpp-turboquant-hip)
- [`domvox/triattention-ggml`](https://github.com/domvox/triattention-ggml)
- [`WeianMao/triattention`](https://github.com/WeianMao/triattention)

The exact audited upstream heads and attribution notes are tracked in
[docs/FUSION_GITHUB_SOURCES_AND_LICENSES.md](docs/FUSION_GITHUB_SOURCES_AND_LICENSES.md)
and [docs/FUSION_UPSTREAMS.json](docs/FUSION_UPSTREAMS.json).

## Upstream Tracking

To refresh the tracked GitHub remotes and see what changed upstream:

```bash
python3 scripts/fusion-watch-upstreams.py --sync-remotes --fetch
```

That updates the local remotes and prints the tracked upstream state.

This repo also includes a scheduled GitHub Actions workflow that refreshes
[docs/UPSTREAM_STATUS.md](docs/UPSTREAM_STATUS.md) inside this repo only.

- It does not auto-merge upstream code.
- It does not open pull requests against upstream source repositories.
- It does not make this repository a GitHub fork.

The automation policy is documented in
[docs/UPSTREAM_AUTOMATION.md](docs/UPSTREAM_AUTOMATION.md).

## Licensing

This repository remains under the upstream MIT license from `llama.cpp`.

- top-level code license: [LICENSE](LICENSE)
- short attribution summary: [LICENSES_AND_ATTRIBUTION.md](LICENSES_AND_ATTRIBUTION.md)
- provenance note: [NOTICE.md](NOTICE.md)
- bundled third-party notices: [licenses/](licenses)

Model weights are not included in this repository. Any GGUF, tokenizer,
projector, or calibration asset loaded with this runtime keeps its own upstream
license and usage terms.

## Notes

- This repo is intentionally a downstream integration snapshot.
- Benchmark notes preserved here may reference the original local test box, but
  the build system and source tree are kept portable.
- If you only need a plain upstream runtime, start from `ggml-org/llama.cpp`
  instead.
