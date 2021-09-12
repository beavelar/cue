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
		if isinstance(rating, str):
			self.rating = rating
			self.element = element
		else:
			raise TypeError('Non-string parameter passed for rating when creating point, unable to create point')