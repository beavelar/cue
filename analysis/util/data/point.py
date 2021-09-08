import logging

#########################################################################################################
# Logger definition

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

#########################################################################################################

# TODO: Create more logs
# TODO: Relocate to data directory instead of util.data as this is a class
class point:
	'''
	point
	----------

	This class will contain a specific data point and what group it belongs in:

	- bad

	- okay

	- good

	- best
	'''
	def __init__(self, rating: str, element: any) -> None:
		self.rating = rating
		self.element = element