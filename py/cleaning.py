import pandas as pd
pd.set_option('display.max_rows', None)
data = pd.read_csv("../data/states_all_extended.csv")
scores = pd.read_csv("../data/naep_states_summary.csv")

selected_data = data[['PRIMARY_KEY','STATE','YEAR','ENROLL','TOTAL_REVENUE','FEDERAL_REVENUE','STATE_REVENUE','LOCAL_REVENUE','TOTAL_EXPENDITURE','INSTRUCTION_EXPENDITURE','SUPPORT_SERVICES_EXPENDITURE','OTHER_EXPENDITURE','CAPITAL_OUTLAY_EXPENDITURE']]
scores = scores.drop(columns=['STATE','YEAR'])

result = selected_data.merge(scores, left_on='PRIMARY_KEY', right_on='PRIMARY_KEY')
# result['AVG_SCORE'] = result['AVG_MATH_4_SCORE'] + result['AVG_MATH_8_SCORE'] + result['AVG_READING_4_SCORE'] + result['AVG_READING_8_SCORE']

result.to_csv('../data/filtered.csv', index=False)

# #print(len(pd.unique(data['STATE'])))
# for i in range(1992, 2020, 1):
#     filtered_data = data[data['YEAR'] == i]
#     # print(filtered_data)
#     # print(filtered_data.isna().sum())

#     frame[str(i) + '_NAs'] = list(filtered_data.isna().sum())


# 1715 rows
