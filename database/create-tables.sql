CREATE TABLE option_type_list (
	option_type varchar(4) PRIMARY KEY
);

CREATE TABLE day_of_week_list (
	day_of_week varchar(9) PRIMARY KEY
);

CREATE TABLE rating_list (
	rating varchar(4) PRIMARY KEY
);

CREATE TABLE historical (
	ticker varchar(5) NOT NULL,
	option_type varchar(4) NOT NULL,
	alerted_at timestamp NOT NULL,
	day_of_week varchar(9) NOT NULL,
	expiry date NOT NULL,
	days_to_exp smallint NOT NULL,
	strike float NOT NULL,
	underlying float NOT NULL,
	diff float NOT NULL,
	volume smallint NOT NULL,
	open_interest smallint NOT NULL,
	vol_oi float NOT NULL,
	implied_volatility float NOT NULL,
	delta float NOT NULL,
	gamma float NOT NULL,
	vega float NOT NULL,
	theta float NOT NULL,
	rho float NOT NULL,
	alert_ask float NOT NULL,
	highest_ask float NOT NULL,
	p_l float NOT NULL,
	time_passed smallint NOT NULL,
	FOREIGN KEY (option_type) REFERENCES option_type_list(option_type),
	FOREIGN KEY (day_of_week) REFERENCES day_of_week_list(day_of_week)
);

CREATE TABLE alerts (
	ticker varchar(5) NOT NULL,
	option_type varchar(4) NOT NULL,
	alerted_at timestamp NOT NULL,
	day_of_week varchar(9) NOT NULL,
	expiry date NOT NULL,
	days_to_exp smallint NOT NULL,
	strike float NOT NULL,
	underlying float NOT NULL,
	diff float NOT NULL,
	volume smallint NOT NULL,
	open_interest smallint NOT NULL,
	vol_oi float NOT NULL,
	implied_volatility float NOT NULL,
	delta float NOT NULL,
	gamma float NOT NULL,
	vega float NOT NULL,
	theta float NOT NULL,
	rho float NOT NULL,
	alert_ask float NOT NULL,
	FOREIGN KEY (option_type) REFERENCES option_type_list(option_type),
	FOREIGN KEY (day_of_week) REFERENCES day_of_week_list(day_of_week)
);

CREATE TABLE ratings_points (
	tag varchar(20) NOT NULL,
	rating varchar(4) NOT NULL,
	datapoint varchar(20) NOT NULL,
	FOREIGN KEY (rating) REFERENCES rating_list(rating)
);

CREATE TABLE ratings_ranges (
	tag varchar(20) NOT NULL,
	rating varchar(4) NOT NULL,
	datarange varchar(20) NOT NULL,
	FOREIGN KEY (rating) REFERENCES rating_list(rating)
);