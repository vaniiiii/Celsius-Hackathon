from PIL import Image
from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import io
import requests
import json
import urllib.request
from urllib.parse import urlparse
    
def getPicture(background, human, hands, top):
    avatarProfile = Image.open("blank.png")
    
    try:
        urllib.request.urlretrieve(background, "pic.png")
        background = Image.open("pic.png")
        avatarProfile.paste(background, (0,0), mask = background)
    except Exception:
        pass
    
    try:
        # Image.open("pic.png")
        # urllib.request.urlretrieve(human, "pic.png")
        human = Image.open("base.png")
        avatarProfile.paste(human, (0,0), mask = human)
    except Exception:
        pass
    
    try:
        urllib.request.urlretrieve(hands, "pic.png")
        hands = Image.open("pic.png")
        avatarProfile.paste(hands, (0,0), mask = hands)
    except Exception:
        pass
    
    try:
        urllib.request.urlretrieve(top, "pic.png")
        top = Image.open("pic.png")
        avatarProfile.paste(top, (0,0), mask = top)
    except Exception:
        pass
    
    img_byte_arr = io.BytesIO()
    avatarProfile.save(img_byte_arr, format='PNG')
    return img_byte_arr.getvalue()
    
# Setting up database
hostName = "localhost"
serverPort = 8080
    
class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        query = urlparse(self.address_string() + self.path).query
        query_components = dict(qc.split("=") for qc in query.split("&"))
        print(query_components["background"])
    
        img_byte_arr = getPicture(\
            query_components["background"], query_components["human"], \
            query_components["hands"], query_components["top"])
    
        self.send_response(200)
        self.send_header("Content-type", "image/png")
        self.end_headers()
        self.wfile.write(img_byte_arr)
    
    
if __name__ == "__main__":
    webServer = HTTPServer((hostName, serverPort), MyServer)
    print("Server started http://%s:%s" % (hostName, serverPort))
    
    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass
    
    webServer.server_close()
    print("Server stopped.")