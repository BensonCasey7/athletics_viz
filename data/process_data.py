import pandas as pd
import numpy

def csv_to_json(file):
    csv = pd.read_csv('./' + file + '.csv')
    csv.to_json('./' + file + '.json', orient='table')

# teams = pd.read_csv('./Teams.csv')
# slim_teams = teams[['yearID', 'name', 'teamID', 'franchID', 'W', 'L', 'H', 'HR', 'BB', 'SO', 'SB', 'CS', 'ERA', 'SOA']]
# slim_teams = slim_teams.query('yearID >= 1985 & yearID <= 2016')
# print(slim_teams)
# slim_teams.to_csv('./slim_teams.csv', index=False)

# salaries = pd.read_csv('./Salaries.csv')
# teams = pd.read_csv('./slim_teams.csv')
# teams['salary'] = ''
# row_num = 0
# for year in range(1985, 2017):
#     teams_in_year = teams.query('yearID == ' + str(year))
#     for index, row in teams_in_year.iterrows():
#         row_num += 1
#         if row_num % 100 == 0:
#             print(row_num)
#         teamID = row['teamID']
#         # df_row = df.query('x == ' + str(thing['px']) + ' & z == ' + str(thing['pz']) + ' & count == "' + str(thing['count']) + '"').index.values.astype(int)[0]
#         df_row = teams.query('yearID == ' + str(year) + ' & teamID == "' + teamID + '"').index.values.astype(int)[0]
#         players = salaries.query('yearID == ' + str(year) + ' & teamID == "' + teamID + '"')
#         running_salary = 0
#         for index, player_row in players.iterrows():
#             # print(player_row)
#             running_salary += int(player_row['salary'])
#         teams.loc[df_row, 'salary'] = running_salary
# print(teams)
# teams.to_csv('./teams_with_salaries.csv', index=False)

# csv_to_json('teams_with_salaries')

# batting = pd.read_csv('./Batting.csv')
# slim_batting = batting[['playerID', 'yearID', 'teamID', 'G', 'AB', 'H', 'HR', 'BB', 'SO', 'SB', 'CS']]
# slim_batting = slim_batting.query('yearID >= 1985 & yearID <= 2016')
# print(slim_batting)
# slim_batting.to_csv('./slim_batting.csv', index=False)


# salaries = pd.read_csv('./Salaries.csv')
# batting = pd.read_csv('./slim_batting.csv')
# batting['salary'] = ''
# row_count = 0
# error_count = 0
# for index, row in batting.iterrows():
#     row_count += 1
#     if row_count % 1000 == 0:
#         print(row_count)
#     try:
#         df_row = batting.loc[(batting['yearID'] == row['yearID']) & (batting['playerID'] == row['playerID'])].index.values.astype(int)[0]
#         salary = salaries.loc[(salaries['yearID'] == row['yearID']) & (salaries['playerID'] == row['playerID'])]['salary'].values.astype(int)[0]
#         batting.loc[df_row, 'salary'] = salary
#     except:
#         error_count += 1
# print(error_count)
# print(batting)
# batting.to_csv('./batting_with_salaries.csv', index=False)

# batting = pd.read_csv('./batting_with_salaries.csv')
# batting['walk_rate'] = ''
# row_count = 0
# for index, row in batting.iterrows():
#     row_count += 1
#     if row_count % 10000 == 0:
#         print(row_count)
#     if row['AB'] == 0:
#         walk_rate = 0
#     else:
#         walk_rate = row['BB'] / row['AB']
#     # df_row = batting.loc[(batting['yearID'] == row['yearID']) & (batting['playerID'] == row['playerID'])].index.values.astype(int)[0]
#     # df_row = row.index.values.astype(int)[0]
#     batting.loc[index, 'walk_rate'] = walk_rate
# print(batting)
# batting.to_csv('./batting_with_salaries.csv', index=False)

# csv_to_json('batting_with_salaries')

# teams = pd.read_csv('./teams_with_salaries.csv')
# teams = teams[['yearID', 'name', 'teamID', 'W', 'L', 'salary']]
# teams['cost_per_win'] = ''
# for index, row in teams.iterrows():
#     teams.loc[index, 'cost_per_win'] = row['salary'] / row['W']
# print(teams)
# teams.to_csv('./cost_per_win.csv', index=False)

# csv_to_json('cost_per_win')
