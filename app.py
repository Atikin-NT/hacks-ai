from flask import Flask, jsonify, render_template
from ml import MLoper
import json

import configparser
config = configparser.ConfigParser()
config.read('./config.ini')
ml_config = config['ml']

predict_model = MLoper("./data_sience/pop_4_gen_14.keras")

app = Flask(__name__)

json_template = {
    'status': True,
    'data': ''
}

@app.route('/api/v1.0/check', methods=['GET'])
def check():
    return jsonify(json_template)

@app.route('/api/v1.0/get_station_list', methods=['GET'])
def get_station_list():
    answer = json_template.copy()

    with open('./shedule.json', 'r') as file:
        data = json.load(file)
    
    answer['data'] = data['station_list']
    
    return jsonify(answer)


@app.route('/api/v1.0/get_shedule_by_station/<int:station_id>', methods=['GET'])
def get_shedule_by_stationet(station_id: int):
    """вывод расписания по id станции

    Args:
        station_id (int): id станции

    Returns:
        _type_: список состоящий из расписания
    """
    answer = json_template.copy()

    with open('./shedule.json', 'r') as file:
        data = json.load(file)

    shedule = data['shedule']
    answer['data'] = []
    for train_time in shedule:
        if train_time['st'] == station_id:
            answer['data'].append(train_time)

    return jsonify(answer)

@app.route('/api/v1.0/post', methods=['POST'])
def post():
    answer = json_template.copy()

    # операции с answer
    
    return jsonify(answer)

@app.route('/')
def main():

    # вывод главной страницы

    return render_template('main.html')

if __name__ == '__main__':
    predict_model.generate_sheduke("./data_sience/real_data.json")
    app.run()