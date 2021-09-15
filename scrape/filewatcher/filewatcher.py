import os
import shutil
import logging
from watchdog.events import (DirCreatedEvent, DirDeletedEvent, DirModifiedEvent, DirMovedEvent,
	FileCreatedEvent, FileDeletedEvent, FileModifiedEvent, FileMovedEvent, FileSystemEvent,
	FileSystemEventHandler)

#########################################################################################################

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

#########################################################################################################

class filewatcher(FileSystemEventHandler):
	'''
	filewatcher
	----------

	This class will handle the file events occuring on the desired directory
	
	Available class variables:

	- parsed_path - Will contain the string path of where the parsed files will be saved to

	- processed_path - Will contain the string path of where the processed files will be moved to
	'''
	def __init__(self, parsed_path: str, processed_path: str) -> None:
		'''
		filewatcher
		----------

		Creates a filewatcher object which will utilize the FileSystemEventHandler __init__ function and set the

		parsed_path and processed_path variables

		- parsed_path - Will contain the string path of where the parsed files will be saved to

		- processed_path - Will contain the string path of where the processed files will be moved to
		'''
		FileSystemEventHandler.__init__(self)
		self.parsed_path = parsed_path
		self.processed_path = processed_path

	def on_created(self, event: DirCreatedEvent or FileCreatedEvent) -> None:
		'''
		on_created
		----------

		This function will handle DirCreatedEvents or FileCreatedEvents.  We don't expect DirCreatedEvents so we

		will assume all events are FileCreatedEvents.  The file from the event will be parsed and copied over to

		the processed directory
		'''
		logger.info(f'New file detected in: {event.src_path}')
		file_name = os.path.basename(event.src_path)
		os.replace(event.src_path, f'{self.processed_path}\\{file_name}')

	# def on_any_event(self, event: FileSystemEvent):
	# 	logger.info(f'{event.event_type}: {event.src_path}')

	# def on_deleted(self, event: DirDeletedEvent or FileDeletedEvent):
	# 	logger.info(f'on_deleted: {event.src_path}')

	# def on_modified(self, event: DirModifiedEvent or FileModifiedEvent):
	# 	logger.info(f'on_modified: {event.src_path}')

	# def on_moved(self, event: DirMovedEvent or FileMovedEvent):
	# 	logger.info(f'on_moved: {event.src_path}')