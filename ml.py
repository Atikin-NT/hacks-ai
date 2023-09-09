import numpy as np
import tensorflow as tf
import keras

class MLoper():
    def __init__(self, model_file):
        self.model = keras.models.load_model(model_file)

    def shedule_cost_res(self):
        train_onboard = copy.deepcopy(train_onboard_main)
        train_time = copy.deepcopy(train_to_time)
        new_stations = copy.deepcopy(stations)
        current_cost = 0
        penalty_count = 0

        for st in new_stations:  # добавляем время простоя каждого вагона
            st.extend([0] * len(stations))

        for i in range(len(train_time)):
            train = train_time[i]
            time = train['time']
            train['onboard'] = [0] * len(new_stations)
            station = train['st'] - 1
            if train['free_carriage'] is None:  # если было прибытие поезда
                for vagon_type in range(len(new_stations)):
                    train['onboard'][vagon_type] = copy.deepcopy(train_onboard[train['id']][vagon_type])
                    if vagon_type != station:  # если вагоны приехали не сюда, то считаем
                        new_stations[station][vagon_type] += train_onboard[train['id']][vagon_type]
                    train_onboard[train['id']][vagon_type] = 0
                continue
            
            # если было отбытие поезда
            # station_resources = copy.deepcopy(new_stations[station][:len(new_stations)])
            # total_export = [sum(st[:len(new_stations)]) for st in new_stations]
            # total_import = get_total_import(new_stations)
            # coming_trains_info = get_train_comes(time, station, TRAIN_INTERVAL, train_onboard)
            # leaving_trains_info = get_train_leave(time, station, TRAIN_INTERVAL)

            # pred = self.model.predict([*station_resources, *total_export, *total_import, *coming_trains_info, *leaving_trains_info])[0]



            enter = copy.deepcopy(new_stations[station][:len(new_stations)])
            enter += [sum(st[:len(new_stations)]) for st in new_stations]
            enter += get_total_import(new_stations)
            enter += get_train_comes(time, station, TRAIN_INTERVAL, train_onboard)
            enter += get_train_leave(time, station, TRAIN_INTERVAL)
            pred = model.predict([enter])[0]



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
