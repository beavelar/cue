import logging
from watchdog.observers import Observer
from filewatcher.filewatcher import filewatcher
from environment.environment import environment
from util.directory.directory_util import create_directories

#########################################################################################################

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

#########################################################################################################

def main(parsed_directory: str, processed_directory: str, unprocessed_directory: str) -> None:
	'''
	main
	----------

	This function will be the main driver of the scraper
	'''
	env = environment()
	if env.realtime_alerts_dir != '':
		directories = [f'{env.realtime_alerts_dir}\\{parsed_directory}', f'{env.realtime_alerts_dir}\\{processed_directory}', f'{env.realtime_alerts_dir}\\{unprocessed_directory}']
		create_directories(directories)

		try:
			logger.info(f'Creating filewatcher for {env.realtime_alerts_dir}\\{unprocessed_directory}')
			event_handler = filewatcher(f'{env.realtime_alerts_dir}\\{parsed_directory}', f'{env.realtime_alerts_dir}\\{processed_directory}')
			observer = Observer()

			logger.info(f'Starting up filewatcher for {env.realtime_alerts_dir}\\{unprocessed_directory}')
			observer.schedule(event_handler, path=f'{env.realtime_alerts_dir}\\{unprocessed_directory}', recursive=False)
			observer.start()

			while True:
				try:
					pass
				except KeyboardInterrupt:
					observer.stop()
		except Exception as ex:
			logger.critical(f'Failed to create filewatcher for {env.realtime_alerts_dir}\\{unprocessed_directory}')
			logger.critical(str(ex))
	else:
		logger.critical(f'Environment variables are not properly defined')
		logger.critical(f'Exiting..')

#########################################################################################################

if __name__ == "__main__":
	parsed_directory = 'Parsed'
	processed_directory = 'Processed'
	unprocessed_directory = 'Unprocessed'
	main(parsed_directory, processed_directory, unprocessed_directory)