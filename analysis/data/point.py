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