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

	def __init__(self, day_input):
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