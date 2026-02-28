#!/usr/bin/env python3
"""
本地開發用 HTTP server，所有回應加上 no-cache header。
用法：python3 serve.py [port]
預設 port：8765
"""
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765

class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        pass  # 關閉每次請求的 log，保持終端乾淨

print(f'🏀 Dev server: http://localhost:{PORT}  (no-cache)')
HTTPServer(('', PORT), NoCacheHandler).serve_forever()
