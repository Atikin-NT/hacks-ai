from flask import Flask, jsonify, render_template, request, redirect, url_for
from ml import MLoper
import json
import os


# объясняется ниже
from werkzeug.utils import secure_filename

# папка для сохранения загруженных файлов
UPLOAD_FOLDER = './data_sience/'
# расширения файлов, которые разрешено загружать
ALLOWED_EXTENSIONS = {'json'}


import configparser
config = configparser.ConfigParser()
config.read('./config.ini')
# ml_config = config['ml']

predict_model = MLoper("./data_sience/pop_20_gen_40.keras", "./data_sience/real_data.json")

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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


def allowed_file(filename):
    """ Функция проверки расширения файла """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/v1.0/put_data', methods=['PUT'])
def put_data():
    answer = json_template.copy()

    if 'file' not in request.files:
        answer['data'] = 'Не могу прочитать файл'
        answer['status'] = False
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        answer['data'] = 'Нет выбранного файла'
        answer['status'] = False
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        predict_model.set_data_path(filename)
        answer['data'] = filename
        answer['status'] = True
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
    predict_model.generate_sheduke()
    app.run()