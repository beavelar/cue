def rate_pl(p_l):
    if p_l <= 0:
        return "BAD"
    elif p_l > 0 and p_l <= 0.5:
        return "OKAY"
    elif p_l > 0.5 and p_l <= 1.5:
        return "GOOD"
    elif p_l > 1.5:
        return "BEST"
