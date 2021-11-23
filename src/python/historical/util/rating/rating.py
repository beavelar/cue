from util.rating.rate import Rate


def rate_pl(p_l):
    # TODO: Figure out how to get rid of 'not serializable' message when doing post with Rate
    # if p_l <= 0:
    # 	return Rate.BAD
    # elif p_l > 0 and p_l <= .5:
    # 	return Rate.OKAY
    # elif p_l > .5 and p_l <= 1.5:
    # 	return Rate.GOOD
    # elif p_l > 1.5:
    # 	return Rate.BEST
    if p_l <= 0:
        return "BAD"
    elif p_l > 0 and p_l <= 0.5:
        return "OKAY"
    elif p_l > 0.5 and p_l <= 1.5:
        return "GOOD"
    elif p_l > 1.5:
        return "BEST"
