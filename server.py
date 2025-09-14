#!/usr/bin/env python3
import http.server
import socketserver
import os
import urllib.parse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_GET(self):
        # Parse the URL
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        print(f"Server: Requested path: {path}")
        print(f"Server: Path exists: {os.path.exists(path[1:]) if path[1:] else False}")
        
        # If it's a root path or a known file, serve normally
        if path == '/' or path == '/index.html' or os.path.exists(path[1:]):
            print(f"Server: Serving file normally: {path}")
            super().do_GET()
            return
        
        # For all other paths (like /vine-maple, /douglas-fir, etc.)
        # serve the main index.html and let the SPA handle routing
        try:
            with open('index.html', 'r', encoding='utf-8') as f:
                content = f.read()
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(content.encode('utf-8'))
        except FileNotFoundError:
            self.send_error(404, "File not found")

if __name__ == "__main__":
    PORT = 3000
    
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}/")
        print("SPA routing enabled - all routes will serve index.html")
        httpd.serve_forever()
