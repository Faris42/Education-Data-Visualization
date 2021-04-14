import pandas as pd
pd.set_option('display.max_rows', None)
data = pd.read_csv("../data/states_all_extended.csv")

#print(data)

#print(data.describe())

#print(data)

#print(data[data['YEAR']>2000].isna().sum())
columns = list(data.columns.values.tolist())

na_frame = pd.DataFrame(columns)

#print(len(pd.unique(data['STATE'])))
for i in range(1992, 2020, 1):
    filtered_data = data[data['YEAR'] == i]
    # print(filtered_data)
    # print(filtered_data.isna().sum())

    na_frame[str(i) + '_NAs'] = list(filtered_data.isna().sum())


na_frame.to_csv('../data/output_full.csv')
# 1715 rows


#for i in range(266):
#   data[:i]