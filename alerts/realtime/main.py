import os
import logging
from watchdog.observers import Observer
from filewatcher.filewatcher import filewatcher
from environment.environment import environment
from util.directory.directory_util import create_directories

#########################################################################################################

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

#########################################################################################################

def main(realtime_alerts_dir: str) -> None:
	'''
	main
	----------

	This function will be the main driver of the scraper
	'''
	directories = [f'{realtime_alerts_dir}\\Parsed', f'{realtime_alerts_dir}\\Processed', f'{realtime_alerts_dir}\\Unprocessed']
	create_directories(directories)

	try:
		logger.info(f'Creating filewatcher for {realtime_alerts_dir}\\Unprocessed')
		event_handler = filewatcher(f'{realtime_alerts_dir}\\Parsed', f'{realtime_alerts_dir}\\Processed')
		observer = Observer()

		logger.info(f'Starting up filewatcher for {realtime_alerts_dir}\\Unprocessed')
		observer.schedule(event_handler, path=f'{realtime_alerts_dir}\\Unprocessed', recursive=False)
		observer.start()

		while True:
			try:
				pass
			except KeyboardInterrupt:
				observer.stop()
	except Exception as ex:
		logger.critical(f'Failed to create filewatcher for {realtime_alerts_dir}\\Unprocessed')
		logger.critical(str(ex))

#########################################################################################################

if __name__ == "__main__":
	env = environment()
	if env.realtime_alerts_dir != '':
		main(env.realtime_alerts_dir)
	else:
		logger.critical(f'Environment variables are not properly defined')
		logger.critical(f'Exiting..')