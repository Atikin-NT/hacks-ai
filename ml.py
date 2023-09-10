import numpy as np
import tensorflow as tf
import keras
import json
import copy

class MLoper():
    def __init__(self, model_file, data_path):
        self.model = keras.models.load_model(model_file)
        self.TRAIN_INTERVAL = 2
        self.data_path = data_path

    def _get_train_leave(self, time, st, count, train_to_time, stations):
        res = []
        for train in train_to_time:
            if train['time'] > time and train['st'] == st and train['free_carriage'] is not None:
                res.append(train['free_carriage'])

            if len(res) == count:
                return res
        
        i = len(res)
        
        for _ in range(i, count):
            res.append(0)
        return res


    def _get_train_comes(self, time, st, count, train_onboard, train_to_time, stations):
        res = []
        for train in train_to_time:
            if train['time'] > time and train['st'] == st and train['free_carriage'] is not None:
                res.extend(train_onboard[train['id']])
            
            if len(res) == count * len(stations):
                return res

        i = len(res) // len(stations)
        
        for _ in range(i, count):
            res.extend([0] * len(stations))
        return res

    def _convert_train_to_time_list(self, train_list):
        train_by_time = []
        for train_id in range(len(train_list)):
            time_list = train_list[train_id]['timetable']

            for i, time in enumerate(time_list):
                before_after = time.split('-')  # [05:24, 05:56]

                for j, rout_part in enumerate(before_after):
                    free_carriage = int(train_list[train_id]['free_carriage'][i]) if j == 1 else None
                    free_carriage = None if free_carriage == 0 else free_carriage
                    hour, minut = [int(x) for x in rout_part.split(':')]
                    new_t = hour * 100 + minut
                    if i > 0 and train_by_time[-1]['time'] > new_t:
                        new_t *= 1000
                    
                    train_by_time.append({
                        'id': train_id, 
                        'time': new_t,
                        'st': int(train_list[train_id]['route'][i]), 
                        'free_carriage': free_carriage
                    })
        return train_by_time

    def _prepare_data(self, data):
        stations = [list(map(int, x)) for x in data['stations'].values()]
        
        trains = [x for x in data['full_timetable'].values()]
        for train in trains:
            train['free_carriage'].append(0)

        train_time = self._convert_train_to_time_list(trains)
        train_time = sorted(train_time, key = lambda x: x['time'])

        train_onboard = [[0] * len(stations) for _ in range(len(data['full_timetable']))]

        return train_onboard, train_time, stations, 


    def set_data_path(self, data_path):
        self.data_path = data_path

    def generate_sheduke(self):
        with open(f'./{self.data_path}', 'r') as file:
            data = json.load(file)

        data = data[0]

        train_onboard, train_time, stations = self._prepare_data(data)
        self.shedule_cost_res(train_onboard, train_time, stations, data)
        
    def _get_total_import(self, new_stations):
        column_sums = []
        for j in range(len(new_stations)):
            column_sum = 0
            for i in range(len(new_stations)):
                column_sum += new_stations[i][j]
            column_sums.append(column_sum)
        return column_sums


    def shedule_cost_res(self, train_onboard, train_time, stations, data):
        new_stations = stations

        for st in new_stations:  # добавляем время простоя каждого вагона
            st.extend([0] * len(stations))

        for i in range(len(train_time)):
            train = train_time[i]
            time = train['time']
            train['onboard'] = [0] * len(new_stations)
            station = train['st'] - 1
            if train['free_carriage'] is None:  # если было прибытие поезда (прибытие = ничего не отвозим)
                for vagon_type in range(len(new_stations)):
                    train['onboard'][vagon_type] = copy.deepcopy(train_onboard[train['id']][vagon_type])
                    if vagon_type != station:  # если вагоны приехали не сюда, то считаем
                        new_stations[station][vagon_type] += train_onboard[train['id']][vagon_type]
                    train_onboard[train['id']][vagon_type] = 0
                continue
            
            # если было отбытие поезда
            station_resources = new_stations[station][:len(new_stations)]
            total_export = [sum(st[:len(new_stations)]) for st in new_stations]
            total_import = self._get_total_import(new_stations)
            coming_trains_info = self._get_train_comes(time, station, self.TRAIN_INTERVAL, train_onboard, train_time, stations)
            leaving_trains_info = self._get_train_leave(time, station, self.TRAIN_INTERVAL, train_time, stations)

            pred = self.model.predict([[*station_resources, *total_export, *total_import, *coming_trains_info, *leaving_trains_info]])[0]

            onboard_val = 0
            for _ in range(len(pred)):
                curr_id = np.argmax(pred)
                avaiable_val = min(train['free_carriage'] - onboard_val, new_stations[station][curr_id])

                if avaiable_val == new_stations[station][curr_id]:  # сбрасываем счетчик времени, если уехали все вагоны этого типа
                    new_stations[station][curr_id + len(stations)] = 0

                onboard_val += avaiable_val
                if onboard_val > train['free_carriage']:
                    break

                new_stations[station][curr_id] -= avaiable_val
                train_onboard[train['id']][curr_id] += avaiable_val

                pred[curr_id] = -1

            train['onboard'] = copy.deepcopy(train_onboard[train['id']])

            for vagon_type in range(len(new_stations)):
                if new_stations[station][vagon_type] != 0:
                    new_stations[station][vagon_type + len(stations)] += 1

        stations_list = [
            {'id': id, 'name': name.split(' ')[0] } for id, name in enumerate(data['stations'].keys())
        ]

        result = {
            'station_list': stations_list,
            'shedule': train_time
        }
        json.dump(result, open('shedule.json', 'w+')) 
