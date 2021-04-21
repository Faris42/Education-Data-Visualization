import pandas as pd
import numpy as np

pd.set_option('display.max_rows', None)
data = pd.read_csv("../data/states_all_extended.csv")
scores = pd.read_csv("../data/naep_states_summary.csv")
# csv2009 = pd.read_csv('../data/nst-est2009-alldata.csv')
# csv2019 = pd.read_csv('../data/nst-est2019-alldata.csv')
census_data = pd.read_csv('../data/agg_census.csv')
gdp = pd.read_csv('../data/SAGDP1__ALL_AREAS_1997_2020.csv')

# MERGE IN SCORES
selected_data = data[['PRIMARY_KEY','STATE','YEAR','ENROLL','TOTAL_REVENUE','FEDERAL_REVENUE','STATE_REVENUE','LOCAL_REVENUE','TOTAL_EXPENDITURE','INSTRUCTION_EXPENDITURE','SUPPORT_SERVICES_EXPENDITURE','OTHER_EXPENDITURE','CAPITAL_OUTLAY_EXPENDITURE']]
scores = scores.drop(columns=['STATE','YEAR'])
result = selected_data.merge(scores, left_on='PRIMARY_KEY', right_on='PRIMARY_KEY')
result = result.drop(result[(result['STATE']=='NATIONAL') | (result['STATE']=='DODEA') | (result['STATE']=='DISTRICT_OF_COLUMBIA')].index)
result = result.drop(result[(result['YEAR'] < 2000) | (result['YEAR'] > 2016)].index)


def average_scores(row):
    count = 0
    total = 0
    if pd.notnull(row['AVG_MATH_4_SCORE']):
        count += 1
        total += row['AVG_MATH_4_SCORE']
    if pd.notnull(row['AVG_MATH_8_SCORE']):
        count += 1
        total += row['AVG_MATH_8_SCORE']
    if pd.notnull(row['AVG_READING_4_SCORE']):
        count += 1
        total += row['AVG_READING_4_SCORE']
    if pd.notnull(row['AVG_READING_8_SCORE']):
        count += 1
        total += row['AVG_READING_8_SCORE']
    if count == 0:
        return None
    return total / count

result['AVG_SCORE'] = result.apply (lambda row: average_scores(row), axis=1)
result = result.drop(result[pd.isnull(result['AVG_SCORE'])].index)

# MERGING CENSUS DATA
# csv2019_reduced = csv2019[['NAME', 'CENSUS2010POP', 'POPESTIMATE2011', 'POPESTIMATE2012', 'POPESTIMATE2013', 'POPESTIMATE2014', 'POPESTIMATE2015', 'POPESTIMATE2016', 'POPESTIMATE2017', 'POPESTIMATE2018', 'POPESTIMATE2019']]
# csv2019_reduced.columns = ['Geographic Area', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019']
# csv2009_reduced = csv2009[['Geographic Area', '2000', '2001', '2002' , '2003', '2004', '2005', '2006', '2007', '2008','2009']]

# census_data = csv2009_reduced.merge(csv2019_reduced, left_on='Geographic Area', right_on='Geographic Area')

result = result.set_index('PRIMARY_KEY')

# CENSUS AND POPULATION DATA
pop_rows = []
for index, row in census_data.iterrows():
    state = row['Geographic Area']
    if state not in ['District of Columbia']:
        for year in list(census_data.columns.values):
            try:
              int(year)
            except: 
                continue
            primary_key = year + '_' + state.replace(' ','_').upper()
            pop_rows.append([primary_key, row[year]])
population = pd.DataFrame(pop_rows, columns=['PRIMARY_KEY','POPULATION'])
result = result.merge(population, left_on='PRIMARY_KEY', right_on='PRIMARY_KEY')

# GDP DATA
gdp = gdp.drop(gdp[gdp['LineCode'] != 1].index)
gdp_rows = []
for index, row in gdp.iterrows():
    state = row['GeoName']
    for year in list(gdp.columns.values):
        try:
          int(year)
        except: 
            continue
        primary_key = year + '_' + state.replace(' ','_').upper()
        gdp_rows.append([primary_key, row[year]])
gdp_df = pd.DataFrame(gdp_rows, columns=['PRIMARY_KEY','GDP'])
result = result.merge(gdp_df, left_on='PRIMARY_KEY', right_on='PRIMARY_KEY')

result['GDP_PER_CAPITA'] = result['GDP'] / result['POPULATION']

result.to_csv('../data/final.csv')