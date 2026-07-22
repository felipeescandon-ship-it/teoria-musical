#!/usr/bin/env python3
"""Static dev server for local development, with caching disabled.

Why this exists instead of plain `python3 -m http.server`: that server sends no
Cache-Control and no ETag, so browsers fall back to heuristic caching and keep running
STALE ES modules after a file changes. That silently invalidates local verification —
you click a button and test the previous version of the code without any error to warn you.

This is a local-only problem: GitHub Pages, where this app is actually hosted, sends
`cache-control: max-age=600` plus an ETag, so real visitors revalidate on their own. The fix
therefore belongs in the dev server, not in the app's import paths.
"""
import http.server
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8811


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


class ReusableServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True  # avoids "Address already in use" on quick restarts
    daemon_threads = True


if __name__ == "__main__":
    with ReusableServer(("", PORT), NoCacheHandler) as httpd:
        print(f"Servidor de desarrollo (sin caché) en http://localhost:{PORT}")
        httpd.serve_forever()
