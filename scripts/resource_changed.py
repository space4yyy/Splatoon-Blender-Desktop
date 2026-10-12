#!/usr/bin/env python3
"""Compute the offline resource identity and compare it with the last release."""

import hashlib
import json
import sys
from pathlib import Path


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        while chunk := stream.read(1024 * 1024):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> int:
    if len(sys.argv) != 3:
        raise SystemExit("usage: resource_changed.py SOURCE_DIR PREVIOUS_RESOURCE_TAG")

    source = Path(sys.argv[1]).resolve()
    previous_tag = sys.argv[2]
    config_path = source / "offline-resources.json"
    config = json.loads(config_path.read_text(encoding="utf-8"))

    files = []
    for name in config["roots"]:
        root = source / name
        if not root.exists():
            raise SystemExit(f"Missing resource root: {name}")
        if root.is_symlink():
            raise SystemExit(f"Symlink not supported: {root}")
        paths = sorted(root.rglob("*") if root.is_dir() else [root])
        for path in paths:
            if path.is_symlink():
                raise SystemExit(f"Symlink not supported: {path}")
            if path.is_file() and path.name != ".DS_Store":
                files.append({
                    "path": path.relative_to(source).as_posix(),
                    "size": path.stat().st_size,
                    "sha256": sha256_file(path),
                })

    files.sort(key=lambda item: item["path"])
    identity = hashlib.sha256()
    for item in files:
        identity.update(
            f'{item["path"]}\0{item["size"]}\0{item["sha256"]}\n'.encode()
        )
    resource_id = identity.hexdigest()
    current_tag = f"resources-v1-{resource_id}"
    print(f"resource_id={resource_id}")
    print(f"changed={str(current_tag != previous_tag).lower()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
