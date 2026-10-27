#!/usr/bin/env python3
"""Tải tranh thật từ Wikimedia Commons (Python stdlib, không cần pip install).
Chạy từ thư mục thiệp:  python tools/download_art.py
Các ảnh 2D lấy từ tác phẩm public domain, KHÔNG tạo bằng AI.
"""
from __future__ import annotations
import json, pathlib, time, urllib.request, urllib.error, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
manifest = json.loads((ROOT / 'assets/images/art_manifest.json').read_text(encoding='utf-8'))
ok = 0
for artwork in manifest:
    destination = ROOT / artwork['local']
    if destination.is_file() and destination.stat().st_size > 5000:
        print(f"[CÓ SẴN] {destination.name}")
        ok += 1
        continue
    try:
        req = urllib.request.Request(
            artwork['url'],
            headers={'User-Agent': 'AnniversaryVFoldPersonalCard/1.0 (Wikimedia Commons public artworks)', 'Accept': 'image/jpeg,image/*'}
        )
        print(f"[ĐANG TẢI] {artwork['key']}…", flush=True)
        with urllib.request.urlopen(req, timeout=35) as response:
            content = response.read()
        if content[:3] != b'\xff\xd8\xff' or len(content) < 5000:
            raise ValueError('Server không trả về ảnh JPEG hợp lệ.')
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(content)
        print(f"[OK] {destination} ({len(content):,} bytes)")
        ok += 1
        time.sleep(.45)
    except Exception as exc:
        print(f"[KHÔNG TẢI ĐƯỢC] {artwork['key']}: {exc}")
        print(f"         Ảnh vẫn có thể tự tải online trong trình duyệt từ: {artwork['url']}")
print(f"\nĐã có {ok}/{len(manifest)} ảnh local.")
if ok < len(manifest):
    print('Hãy đảm bảo có Internet rồi chạy lại. Không ảnh hưởng đến phần code và hiệu ứng mở thiệp.')
    sys.exit(1)
print('Giờ bạn có thể mở index.html để xem tranh mà không cần mạng.')
