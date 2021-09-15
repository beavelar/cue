import logging

from watchdog.events import (DirCreatedEvent, DirDeletedEvent, DirModifiedEvent, DirMovedEvent, \
	FileCreatedEvent, FileDeletedEvent, FileModifiedEvent, FileMovedEvent, FileSystemEvent, \
	FileSystemEventHandler)

#########################################################################################################

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

#########################################################################################################

class filewatcher(FileSystemEventHandler):
    def on_created(self, event: DirCreatedEvent or FileCreatedEvent):
        logger.info(f'on_created: {event.src_path}')

    # def on_any_event(self, event: FileSystemEvent):
    #     logger.info(f'{event.event_type}: {event.src_path}')

    # def on_deleted(self, event: DirDeletedEvent or FileDeletedEvent):
    #     logger.info(f'on_deleted: {event.src_path}')

    # def on_modified(self, event: DirModifiedEvent or FileModifiedEvent):
    #     logger.info(f'on_modified: {event.src_path}')
        
    # def on_moved(self, event: DirMovedEvent or FileMovedEvent):
    #     logger.info(f'on_moved: {event.src_path}')