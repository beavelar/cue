import logging
import collections
import numpy as np
from datetime import datetime
from util.data.point import point

#########################################################################################################
# Logger definition

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

#########################################################################################################

class ranges:
	'''
	ranges
	----------

	This class will contain the data points and the groups they belong in

	Data is structure as followed:
	
	- elements

		- dict: { bad: int, okay: int, good: int, best: int }
	
	- points

		- list of point

		- list is sorted

	- groups

		- dict: { bad: list of any, okay: list of any, good: list of any, best: list of any }

		- list is sorted
	'''
	def __init__(self, np: np.ndarray, pl_np: np.ndarray) -> None:
		self.elements = {}
		self.points = []
		self.ratings = {
			'bad': [],
			'okay': [],
			'good': [],
			'best': []
		}

		self.populate_elements(np, pl_np)
		self.sort_elements()
		self.populate_groups()
		self.populate_points()

#########################################################################################################

	def populate_elements(self, np: np.ndarray, pl_np: np.ndarray) -> None:
		'''
		populate_elements
		----------

		This function will populate self.elements with the elements from np

		Each element contains a counter indicating how many BAD, OKAY, GOOD, and BEST elements are mapped to that point
		
		Elements will be added as followed:

		- bad: P/L <= 0

		- okay: 0 < P/L <= 0.5

		- good: 0.5 < P/L <= 1.5

		- best: 1.5 < P/L
		'''
		for index in range(np.size):
			point = np[index]
			p_l = pl_np[index]
			if point not in self.elements:
				self.elements[point] = { 'bad': 0, 'okay': 0, 'good': 0, 'best': 0, 'lead': None }
			if p_l <= 0:
				self.elements[point]['bad'] = self.elements[point]['bad'] + 1
			elif p_l > 0 and p_l <= .5:
				self.elements[point]['okay'] = self.elements[point]['okay'] + 1
			elif p_l > .5 and p_l <= 1.5:
				self.elements[point]['good'] = self.elements[point]['good'] + 1
			elif p_l > 1.5:
				self.elements[point]['best'] = self.elements[point]['best'] + 1
			lead = self.get_lead(point)
			self.elements[point]['lead'] = lead

#########################################################################################################

	def get_lead(self, point: any) -> str:
		'''
		get_lead
		----------

		This function will view which counter from a point from the elements dict is the highest
		'''
		lead = 'bad'
		lead_value = self.elements[point]['bad']
		if lead_value < self.elements[point]['okay']:
			lead = 'okay'
			lead_value = self.elements[point]['okay']
		if lead_value < self.elements[point]['good']:
			lead = 'good'
			lead_value = self.elements[point]['good']
		if lead_value < self.elements[point]['best']:
			lead = 'best'
			lead_value = self.elements[point]['best']
		return lead
	
#########################################################################################################

	def sort_elements(self) -> None:
		'''
		sort_elements
		----------

		This function will sort the elements dict to be a OrderedDict
		'''
		self.elements = collections.OrderedDict(sorted(self.elements.items()))

#########################################################################################################

	def populate_groups(self) -> None:
		'''
		populate_groups
		----------

		This function will populate self.ratings with the elements from self.elements

		self.elements is to be sorted before utilizing populate_groups to ensure groups are sorted
		'''
		for point in self.elements:
			lead = self.get_lead(point)
			self.ratings[lead].append(point)

#########################################################################################################

	def populate_points(self) -> None:
		'''
		populate_points
		----------

		This function will populate self.points with the points from self.ratings

		self.ratings is to be sorted before utilizing populate_points to ensure points are sorted
		'''
		elems = {
			'bad': None,
			'okay': None,
			'good': None,
			'best': None
		}
		bad_list = self.ratings['bad'].copy()
		okay_list = self.ratings['okay'].copy()
		good_list = self.ratings['good'].copy()
		best_list = self.ratings['best'].copy()

		while not (len(bad_list) == 0 and len(okay_list) == 0 and len(good_list) == 0 and len(best_list) == 0):
			if len(bad_list) > 0 and elems['bad'] == None:
				elems['bad'] = bad_list.pop(0)
			if len(okay_list) > 0 and elems['okay'] == None:
				elems['okay'] = okay_list.pop(0)
			if len(good_list) > 0 and elems['good'] == None:
				elems['good'] = good_list.pop(0)
			if len(best_list) > 0 and elems['best'] == None:
				elems['best'] = best_list.pop(0)

			lowest = self.get_lowest(elems)
			self.points.append(point(lowest, elems[lowest]))
			elems[lowest] = None

#########################################################################################################

	def get_lowest(self, elems: dict) -> str:
		'''
		get_lowest
		----------

		This function will return the lowest value from the provided dict

		elems should be structured as followed:

		- bad: any

		- okay: any

		- good: any

		- best: any
		'''
		if self.less_than(elems['bad'], elems['okay'], elems['good'], elems['best']):
			return 'bad'
		elif self.less_than(elems['okay'], elems['bad'], elems['good'], elems['best']):
			return 'okay'
		elif self.less_than(elems['good'], elems['bad'], elems['okay'], elems['best']):
			return 'good'
		elif self.less_than(elems['best'], elems['bad'], elems['okay'], elems['good']):
			return 'best'

#########################################################################################################

	def less_than(self, first: any, second: any, third: any, fourth: any) -> bool:
		'''
		less_than
		----------

		This function will return whether first is less than the provided parameters

		Parameter possibilities:

		- Monday | Tuesday | Wednesday | Thursday | Friday

		- hh:mm:ss

		- int
		'''
		week_days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
		if first is not None:
			try:
				int(first)
				if (second is None or first < second) and \
					(third is None or first < third) and \
					(fourth is None or first < fourth):
					return True
			except:
				if first in week_days or second in week_days or third in week_days or fourth in week_days:
					first_index = week_days.index(first)
					second_index = week_days.index(second) if second is not None else 1000000
					third_index = week_days.index(third) if third is not None else 1000000
					fourth_index = week_days.index(fourth) if fourth is not None else 1000000
					if first_index < second_index and \
						first_index < third_index and \
						first_index < fourth_index:
						return True
				elif ':' in first or ':' in second or ':' in third or ':' in fourth:
					first_time = datetime.strptime(first, "%H:%M:%S")
					second_time = datetime.strptime(second, "%H:%M:%S") if second is not None else datetime.max
					third_time = datetime.strptime(third, "%H:%M:%S") if third is not None else datetime.max
					fourth_time = datetime.strptime(fourth, "%H:%M:%S") if fourth is not None else datetime.max
					if first_time < second_time and \
						first_time < third_time and \
						first_time < fourth_time:
						return True
		return False

#########################################################################################################

	def to_numpy(self):
		'''
		to_numpy
		----------

		This function will return self.points list as a numpy array
		'''
		return np.array(self.points)