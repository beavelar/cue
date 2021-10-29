import asyncio
import logging
import simplejson
from environment.environment import environment
from http.server import BaseHTTPRequestHandler, HTTPServer

#########################################################################################################

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

class Server(BaseHTTPRequestHandler):
	def set_headers(self):
		self.send_response(200)
		self.send_header('Content-type', 'application/json')
		self.end_headers()

	def do_HEAD(self):
		self.set_headers()

	def do_POST(self):
		if self.path == '/historical':
			content_len = int(self.headers.get('Content-Length'))
			post_body = self.rfile.read(content_len)
			data = simplejson.loads(post_body)

			self.send_response(200)
			self.end_headers()

#########################################################################################################

async def run(hostname, port):
	server = HTTPServer((hostname, port), Server)
	logger.info(f'Server is up and listening on port: {port}')

	try:
		server.serve_forever()
	except KeyboardInterrupt:
		pass

	server.server_close()
	logger.info('Server stopped')

#########################################################################################################

if __name__ == "__main__":
	env = environment()
	loop = asyncio.get_event_loop()
	task = [loop.create_task(run(env.historical_server_hostname, int(env.historical_server_port)))]
	loop.run_until_complete(asyncio.wait(task))
	loop.close()