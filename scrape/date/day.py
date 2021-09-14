class day:
	'''
	Simple class mapping the day of week to a int

	Mapping
	----------
	- MONDAY : 0
	
	- TUESDAY : 1
	
	- WEDNESDAY : 2
	
	- THURSDAY : 3

	- FRIDAY : 4

	- SATURDAY : 5

	- SUNDAY : 6
	'''
	MONDAY=0
	TUESDAY=1
	WEDNESDAY=2
	THURSDAY=3
	FRIDAY=4
	SATURDAY=5
	SUNDAY=6

	def __init__(self, day_input: int) -> None:
		'''
		__init__
		----------

		Creates a day object. day_input must be a int, otherwise a TypeError will be raised
		'''
		if isinstance(day_input, int):
			if day_input == self.MONDAY:
				self.day = 'Monday'
			elif day_input == self.TUESDAY:
				self.day = 'Tuesday'
			elif day_input == self.WEDNESDAY:
				self.day = 'Wednesday'
			elif day_input == self.THURSDAY:
				self.day = 'Thursday'
			elif day_input == self.FRIDAY:
				self.day = 'Friday'
			else:
				self.day = 'INVALID'
		else:
			raise TypeError('Non-int parameter passed for day_input when creating day, unable to create day')